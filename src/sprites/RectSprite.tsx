import Konva from 'konva';
import React, { useRef, MutableRefObject } from 'react';
import { Rect } from 'react-konva';
import { ShapeProps } from './types';

/**
 * 矩形精灵
 */
const RectSprite: React.FC<{
  shapeProps: ShapeProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = ({ shapeProps, onSelect, onChange }) => {
  // 精灵
  const shapeRef = useRef() as MutableRefObject<Konva.Rect>;

  return (
    <Rect
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      {...shapeProps}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={() => {
        // 缩放用于更方便修改比例
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // 重置比例,防止形变,将比例转为width height
        node.scaleX(1);
        node.scaleY(1);

        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          // 设置最小宽, 防止过小
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
    />
  );
};

export default RectSprite;
