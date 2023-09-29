import create from 'zustand';
import { SpriteType } from '../types/sprite';
import Konva from 'konva';
type Store = {
  drawSpriteType: SpriteType;
  setDrawSpriteType: (by: SpriteType) => void;
  target: Konva.Node | null;
  setTarget: (by: Konva.Node) => void;
};

const useStore = create<Store>()((set) => ({
  drawSpriteType: '',
  setDrawSpriteType: (by: SpriteType) => set(() => ({ drawSpriteType: by })),
  target: null,
  setTarget: (by: Konva.Node) => set(() => ({ target: by })),
}));

export default useStore;
