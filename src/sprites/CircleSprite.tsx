import Konva from 'konva';
import React, { Ref } from 'react';
import { Circle } from 'react-konva';
import { ShapeProps } from './types';

/**
 * 圆形精灵
 */
const CircleSprite: React.FC<{
  shapeProps: ShapeProps;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = React.forwardRef(
  ({ shapeProps, onSelect, onChange }, circle: Ref<Konva.Circle>) => {
    return (
      <Circle
        onClick={onSelect}
        onTap={onSelect}
        ref={circle}
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
          const node = circle.current;

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // 设置最小半径, 防止过小
            radius: Math.max(5, node.radius()),
          });
        }}
      />
    );
  }
);

export default CircleSprite;
