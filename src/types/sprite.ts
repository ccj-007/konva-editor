export type ShapeProps = RectSpriteProps | CircleSpriteProps | TextSpriteProps | GroupSpriteProps | CurveSpriteProps

export type SpriteType = '' | 'RECT' | 'CIRCLE' | 'TEXT' | 'CURVE';

export type RectSpriteProps = {
  name: 'RECT';
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  shadowBlur?: number;
  rotation?: number
};

export type CircleSpriteProps = {
  name: 'CIRCLE';
  id: string;
  x?: number;
  y?: number;
  radius?: number;
  fill?: string;
};

export type TextSpriteProps = {
  name: 'TEXT';
  id: string;
  x?: number;
  y?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
};

export type CurveSpriteProps = {
  name: 'CURVE';
  id: string;
  points: number[]
  stroke: string
  strokeWidth: number
};

export type GroupSpriteProps = {
  name: 'GROUP'
  id: string
  x?: number;
  y?: number;
  children: ShapeProps[]
}
