import Konva from 'konva';
import React, { useRef, useEffect, MutableRefObject } from 'react';
import { Transformer } from 'react-konva';
import { ShapeProps } from './types/types';
import RectSprite from './sprites/RectSprite';
import CircleSprite from './sprites/CircleSprite';

/**
 * 编辑框
 */
const EditRectangle: React.FC<{
  selectes: Konva.Node[];
  shapeProps: ShapeProps;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = ({ selectes, shapeProps, onSelect, onChange }) => {
  // 精灵
  const shape = useRef() as MutableRefObject<Konva.Rect>;
  // 编辑控件
  const tr = useRef() as MutableRefObject<Konva.Transformer>;

  useEffect(() => {
    if (!selectes.length) {
      tr.current.nodes([]);
    } else if (selectes.some((n) => n?.attrs?.id === shapeProps.id)) {
      // 选取新编辑的精灵
      tr.current.nodes([shape.current]);
      // 在当前精灵的图层重新绘制
      tr.current.getLayer().batchDraw();
    }
  }, [selectes]);

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
      {
        <Transformer
          ref={tr}
          id={`Transformer${shapeProps.id}`}
          boundBoxFunc={(oldBox, newBox) => {
            // 根据限制精灵过小时编辑框不更新
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      }
    </>
  );
};

export default EditRectangle;
