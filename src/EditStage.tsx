import Konva from 'konva';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { ShapeProps } from './types';
import EditRectangle from './EditRectangle';

const initialRectangles: ShapeProps[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];

const EditStage: React.FC = () => {
  const [rectangles, setRectangles] = useState<ShapeProps[]>(initialRectangles);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    // 判断是否点击舞台的空白区域
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {rectangles.map((rect, i) => (
          <EditRectangle
            key={i}
            shapeProps={rect}
            isSelected={rect.id === selectedId}
            // 获取选中的id
            onSelect={() => {
              setSelectedId(rect.id);
            }}
            // 更新属性
            onChange={(newAttrs) => {
              const updatedRects = rectangles.map((r) =>
                r.id === rect.id ? newAttrs : r
              );
              setRectangles(updatedRects);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default EditStage;
