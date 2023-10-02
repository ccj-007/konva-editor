import Konva from 'konva'
import React, { MutableRefObject, Ref } from 'react'
import { Circle } from 'react-konva'
import { ShapeProps } from '../types/sprite'

/**
 * 圆形精灵
 */
const CircleSprite: React.FC<{
  shapeProps: ShapeProps
  onSelect: () => void
  onChange: (newAttrs: ShapeProps) => void
}> = React.forwardRef(
  (
    { shapeProps, onSelect, onChange },
    circle: MutableRefObject<Konva.Circle>
  ) => {
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
          })
        }}
        onTransformEnd={() => {
          const node = circle.current
          const scaleX = node.scaleX()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // 设置最小半径, 防止过小
            radius: Math.max(5, node.radius() * scaleX),
          })
        }}
      />
    )
  }
)

export default CircleSprite
