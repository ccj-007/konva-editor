import { CircleSpriteProps, RectSpriteProps } from './types/sprite';
import { v4 as uuidv4 } from 'uuid';

export const createRectSprite = (params?: Partial<RectSpriteProps>) => {
  return Object.assign(
    {
      name: 'RECT',
      x: 10,
      y: 10,
      width: 0,
      height: 0,
      fill: 'red',
      id: uuidv4(),
      shadowBlur: 10,
    },
    params
  );
};

export const createCircleSprite = (params?: Partial<CircleSpriteProps>) => {
  return Object.assign(
    {
      name: 'CIRCLE',
      x: 150,
      y: 150,
      radius: 0,
      fill: 'yellow',
      id: uuidv4(),
    },
    params
  );
};

export const createSpriteMap = {
  RECT: createRectSprite,
  CIRCLE: createCircleSprite,
};
