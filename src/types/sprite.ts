export type ShapeProps = RectSpriteProps | CircleSpriteProps;

export type SpriteType = '' | 'RECT' | 'CIRCLE';

export type RectSpriteProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  shadowBlur?: number;
  id: string;
  name: 'RECT';
};

export type CircleSpriteProps = {
  x?: number;
  y?: number;
  radius?: number;
  fill?: string;
  id: string;
  name: 'CIRCLE';
};
