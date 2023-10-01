import Konva from "konva";
import { MutableRefObject } from "react";

export const findShapes = (stage: MutableRefObject<Konva.Stage>): Konva.Node[] => {
    const nodes = [
        ...stage.current.find('.RECT'),
        ...stage.current.find('.CIRCLE'),
        ...stage.current.find('.TEXT'),
    ]; 
    return nodes
}