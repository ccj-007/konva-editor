import Konva from 'konva';
import React, { MutableRefObject, Ref } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { GroupSpriteProps, ShapeProps } from '../types/sprite';
import useStore from '../store';
/**
 * 组合精灵
 */
const GroupSprite: React.FC<{
  shapeProps: GroupSpriteProps;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = React.forwardRef(
  ({ shapeProps, onSelect, onChange }, shape: MutableRefObject<Konva.Group>) => {
    const { stage, sprites, setSprites } = useStore()

    return (
      <Group
        onClick={onSelect}
        onTap={onSelect}
        ref={shape}
        draggable
        {...shapeProps}
        onDragEnd={(e) => {
          // 更新子节点位置
          e.target.children.forEach((item: Konva.Node) => {
            const pos = item.getAbsolutePosition()
            item.attrs.x = pos.x
            item.attrs.y = pos.y
          })
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shape.current
        }}
      >
        {
          (shapeProps.children || []).map((s, i) => {
            if (s.name === 'RECT') return <Rect key={i} {...s}></Rect>
            if (s.name === 'CIRCLE') return <Circle key={i} {...s}></Circle>
            if (s.name === 'TEXT') return <Text key={i} {...s}></Text>
            if (s.name === 'GROUP') return <GroupSprite key={i} shapeProps={shapeProps} onSelect={onSelect} onChange={onChange}></GroupSprite>
          })
        }
      </Group>
    );
  }
);

export default GroupSprite;
