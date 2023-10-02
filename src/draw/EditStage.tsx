import Konva from 'konva';
import React, { MutableRefObject, useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import EditRectangle from './EditRectangle';
import Marquee from './Marquee';
import SmartAlignment from './SmartAlignment';

import {
  createSpriteMap,
} from './createSpriteObj';
import _ from 'lodash';
import useStore from '../store';

const EditStage: React.FC = () => {
  const { setStage, setDrawSpriteType, setSelects, selects, drawSpriteType, setNodes, nodes, setLayer, sprites, setSprites } = useStore();

  const [drawing, setDrawing] = useState<boolean>(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selObj, setSelObj] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const marquee = useRef() as MutableRefObject<Konva.Rect>;
  const stage = useRef() as MutableRefObject<Konva.Stage>;
  const layer = useRef() as MutableRefObject<Konva.Layer>;
  const [point, setPoint] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    const node: Konva.Node[] = []
    sprites.forEach(sprite => {
      const findNode = stage.current.findOne(`#${sprite.id}`)
      if (findNode) node.push(findNode)
    })
    setNodes(node)
  }, [sprites])


  const checkDeselect = (e: Konva.KonvaPointerEvent) => {
    // 判断是否点击舞台的空白区域
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelects([]);
    }
    setEmpty(clickedOnEmpty);
  };

  const handleMouseDown = (e: Konva.KonvaPointerEvent) => {
    const { offsetX, offsetY } = e.evt;
    console.log(offsetX);

    // 处理点击空白区域
    checkDeselect(e);
    setDrawing(true);

    // 绘制状态
    if (drawSpriteType) {
      setStartPos({ x: offsetX, y: offsetY });
      const newSprite = createSpriteMap[drawSpriteType]({
        x: offsetX,
        y: offsetY,
      });

      setSprites([...sprites, newSprite]);

      setTimeout(() => {
        setSelects(stage.current.find(`#${newSprite.id}`));
      }, 0);
    } // 生成选择框
    else if (isEmpty) {
      setPoint({
        x1: stage.current.getPointerPosition()?.x || 0,
        y1: stage.current.getPointerPosition()?.y || 0,
        x2: stage.current.getPointerPosition()?.x || 0,
        y2: stage.current.getPointerPosition()?.y || 0,
      });
      marquee.current.visible(true);
      setSelObj({ ...selObj, width: 0, height: 0 });
    } else {
      marquee.current.visible(false);
    }
  };

  const handleMouseMove = (e: Konva.KonvaPointerEvent) => {
    // 绘制选择框
    if (marquee.current.visible() && isEmpty) {
      setPoint({
        ...point,
        x2: stage.current.getPointerPosition()?.x || 0,
        y2: stage.current.getPointerPosition()?.y || 0,
      });
      const { x1, y1, x2, y2 } = point;
      setSelObj({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      });
    } else if (drawSpriteType && drawing) {
      // 绘制生成的精灵
      const { offsetX, offsetY } = e.evt;
      const width = offsetX - startPos.x;

      const height = offsetY - startPos.y;
      const cloneSprites = _.cloneDeep(sprites);
      const newSprites = cloneSprites[cloneSprites.length - 1];

      // 更新精灵的最新位置
      if (newSprites.name === 'RECT') {
        Object.assign(newSprites, {
          width,
          height,
        });
      } else if (newSprites.name === 'CIRCLE') {
        Object.assign(newSprites, {
          radius: width,
        });
      }
      setSprites(cloneSprites);
    }
  };

  const handleMouseUp = () => {
    if (marquee.current.visible() && isEmpty) {
      marquee.current.visible(false);

      const box = marquee.current.getClientRect();
      const selectes = nodes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      ) as Konva.Node[];
      setSelects(selectes);
    }

    setDrawSpriteType('');
    setDrawing(false);
  };

  React.useEffect(() => {
    setStage(stage.current);
    setLayer(layer.current)
  }, []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      ref={stage}
    >
      <Layer ref={layer}>
        {sprites.map((rect, i) => (
          <EditRectangle
            selects={selects}
            key={i}
            shapeProps={rect}
            // 获取选中的id
            onSelect={() => {
              const node = stage.current.find(`#${rect.id}`) as Konva.Node[];
              console.log(node, rect.id);
              setSelects(node);
            }}
            // 更新属性
            onChange={(newAttrs) => {
              const updatedRects = sprites.map((r) => {
                if (r.id === rect.id) {
                  return { ...r, ...newAttrs }
                } else {
                  return r
                }
              }
              );
              setSprites(updatedRects);
            }}
          />
        ))}
        {/* 选择框 */}
        <Marquee id='marquee' ref={marquee} {...selObj} />
        {/* 智能对齐 */}
        <SmartAlignment stage={stage} layer={layer} ></SmartAlignment>
      </Layer>
    </Stage>
  );
};

export default EditStage;
