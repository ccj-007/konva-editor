import { CircleSpriteProps, GroupSpriteProps, RectSpriteProps, TextSpriteProps } from '../types/sprite';
import { v4 as uuidv4 } from 'uuid';

export const createRectSprite = (params?: Partial<RectSpriteProps>) => {
  return Object.assign(
    {
      name: 'RECT',
      id: uuidv4(),
      x: 10,
      y: 10,
      width: 0,
      height: 0,
      fill: 'red',
    },
    params
  );
};

export const createCircleSprite = (params?: Partial<CircleSpriteProps>) => {
  return Object.assign(
    {
      name: 'CIRCLE',
      id: uuidv4(),
      x: 150,
      y: 150,
      radius: 0,
      fill: 'yellow',
    },
    params
  );
};

export const createTextSprite = (params?: Partial<TextSpriteProps>) => {
  return Object.assign(
    {
      name: 'TEXT',
      id: uuidv4(),
      x: 300,
      y: 300,
      text: 'Simple Text',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green',
    },
    params
  );
};

export const createGroupSprite = (params?: Partial<GroupSpriteProps>) => {
  return Object.assign(
    {
      name: 'GROUP',
      id: uuidv4(),
      x: 0,
      y: 0,
      children: [
        createRectSprite({
          width: 100,
          height: 100,
          x: 800,
          y: 250,
        }),
        createCircleSprite({
          radius: 50,
          x: 800,
          y: 250,
          fill: 'blue'
        })
      ]
    },
    params
  );
};

export const createSpriteMap = {
  RECT: createRectSprite,
  CIRCLE: createCircleSprite,
  TEXT: createTextSprite,
  GROUP: createGroupSprite
};
