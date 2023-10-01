import create from 'zustand';
import { ShapeProps, SpriteType } from '../types/sprite';
import Konva from 'konva';
import { createCircleSprite, createGroupSprite, createRectSprite, createTextSprite } from '../draw/createSpriteObj';

const initialSprites: ShapeProps[] = [
  createRectSprite({
    x: 620,
    y: 200,
    width: 100,
    height: 100,
  }),
  createCircleSprite({
    x: 800,
    y: 200,
    radius: 100,
  }),
  createTextSprite(),
  createGroupSprite()
];

interface Store {
  /** 当前绘制类型 */
  drawSpriteType: SpriteType;
  setDrawSpriteType: (by: SpriteType) => void;
  /** 舞台节点 */
  stage: Konva.Stage | null;
  setStage: (by: Konva.Stage) => void;
  /** 图层 */
  layer: Konva.Layer | null;
  setLayer: (by: Konva.Layer) => void;
  /** 多选的节点 */
  selects: Konva.Node[]
  setSelects: (by: Konva.Node[]) => void;
  /** 渲染节点 */
  sprites: ShapeProps[]
  setSprites: (by: ShapeProps[]) => void;
  /** 所有 konva 节点 */
  nodes: Konva.Node[]
  setNodes: (by: Konva.Node[]) => void
};

const useStore = create<Store>()((set) => ({
  drawSpriteType: '',
  setDrawSpriteType: (by: SpriteType) => set(() => ({ drawSpriteType: by })),
  stage: null,
  setStage: (by: Konva.Stage) => set(() => ({ stage: by })),
  layer: null,
  setLayer: (by: Konva.Layer) => set(() => ({ layer: by })),
  selects: [],
  setSelects: (by: Konva.Node[]) => set(() => ({ selects: by })),
  nodes: [],
  setNodes: (by: Konva.Node[]) => set(() => ({ nodes: by })),
  sprites: initialSprites,
  setSprites: (by: ShapeProps[]) => set(() => ({ sprites: by })),
}));

export default useStore;
