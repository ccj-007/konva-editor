import Konva from 'konva';
import React, { useRef, useEffect, MutableRefObject } from 'react';
import { Rect, Transformer } from 'react-konva';
import { ShapeProps } from './types';

/**
 * 编辑框
 */
const EditRectangle: React.FC<{
  shapeProps: ShapeProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ShapeProps) => void;
}> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  // 精灵
  const shapeRef = useRef() as MutableRefObject<Konva.Rect>;
  // 编辑控件
  const trRef = useRef() as MutableRefObject<Konva.Transformer>;

  useEffect(() => {
    if (isSelected) {
      // 选取新编辑的精灵
      trRef.current.nodes([shapeRef.current]);
      // 在当前精灵的图层重新绘制
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
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
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // 根据限制荆精灵过小时编辑框不更新
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default EditRectangle;
