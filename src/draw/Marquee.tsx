import type { FC, Ref } from 'react';
import { Rect } from 'react-konva';
import { RectSpriteProps } from '../types/sprite';
import React from 'react';
import Konva from 'konva';

/**
 * 选择框
 */
const Marquee: FC<RectSpriteProps> = React.forwardRef(
  (props, marquee: Ref<Konva.Rect>) => {
    const { x = 0, y = 0, width = 0, height = 0 } = props;

    React.useEffect(() => {
      marquee.current.visible(false);
    }, []);
    return (
      <Rect
        ref={marquee}
        fill='rgba(0, 0, 255, 0.5)'
        x={x}
        y={y}
        width={width}
        height={height}
      ></Rect>
    );
  }
);

export default Marquee;
