import Konva from 'konva';
import React, { useRef, useEffect, MutableRefObject } from 'react';
import { Transformer } from 'react-konva';
import { ShapeProps } from '../types/sprite';
import RectSprite from '../sprites/RectSprite';
import CircleSprite from '../sprites/CircleSprite';
import TextSprite from '../sprites/TextSprite';
import GroupSprite from '../sprites/GroupSprite';
import CurveSprite from '../sprites/CurveSprite';
/**
 * 编辑框
 */
const EditRectangle: React.FC<{
  selects: Konva.Node[];
  shapeProps: ShapeProps;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = ({ selects, shapeProps, onSelect, onChange }) => {
  // 精灵
  const shape = useRef() as MutableRefObject<Konva.Rect>;
  // 编辑控件
  const tr = useRef() as MutableRefObject<Konva.Transformer>;

  useEffect(() => {
    if (selects) {
      tr.current.nodes(selects);
    } else {
      tr.current.nodes([]);
    }
    tr.current.getLayer().batchDraw();
  }, [selects]);

  return (
    <>
      {shapeProps.name === 'RECT' && (
        <RectSprite
          onSelect={onSelect}
          onChange={onChange}
          shapeProps={shapeProps}
          ref={shape}
        />
      )}
      {shapeProps.name === 'CIRCLE' && (
        <CircleSprite
          onSelect={onSelect}
          onChange={onChange}
          shapeProps={shapeProps}
          ref={shape}
        />
      )}
      {shapeProps.name === 'TEXT' && (
        <TextSprite
          onSelect={onSelect}
          onChange={onChange}
          shapeProps={shapeProps}
          tr={tr}
          ref={shape}
        />
      )}
      {shapeProps.name === 'GROUP' && (
        <GroupSprite
          onSelect={onSelect}
          onChange={onChange}
          shapeProps={shapeProps}
          tr={tr}
          ref={shape}
        />
      )}
      {
        shapeProps.name === 'CURVE' && <CurveSprite onSelect={onSelect}
          onChange={onChange}
          shapeProps={shapeProps}
          tr={tr}
          ref={shape} />
      }
      {/* 不同控制逻辑的变换框 */}
      {
        ['CIRCLE', 'RECT', 'GROUP', 'CURVE'].includes(shapeProps.name) && <Transformer
          ref={tr}
          id={`tr${shapeProps.id}`}
          boundBoxFunc={(oldBox, newBox) => {
            // 根据限制精灵过小时编辑框不更新
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      }
      {
        ['TEXT'].includes(shapeProps.name) && <Transformer
          ref={tr}
          enabledAnchors={['middle-left', 'middle-right']}
          id={`tr${shapeProps.id}`}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
          onTransform={() => {
            const text = shape.current
            text.setAttrs({
              width: Math.max(text.width() * text.scaleX(), 20),
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
      }
    </>
  );
};

export default EditRectangle;
