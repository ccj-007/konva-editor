import Konva from 'konva';
import React, { FC, MutableRefObject, useState } from 'react'
import useStore from '../store'

const GUIDELINE_OFFSET = 5;

type Snap = "start" | "center" | "end";
type SnappingEdges = {
    vertical: Array<{
        guide: number;
        offset: number;
        snap: Snap;
    }>;
    horizontal: Array<{
        guide: number;
        offset: number;
        snap: Snap;
    }>;
};

interface SmartAlignmentProps {
    stage: MutableRefObject<Konva.Stage>
    layer: MutableRefObject<Konva.Layer>
}

const SmartAlignment: FC<SmartAlignmentProps> = (props) => {
    const { nodes } = useStore()

    /**
     * 获取所有吸附线
     * @param skipShape 
     * @returns 
     */
    const getLineGuideStops = (skipShape: Konva.Shape, nodes: Konva.Node[]) => {
        const stage = skipShape.getStage();
        if (!stage) return { vertical: [], horizontal: [] };

        const vertical = [0, stage.width() / 2, stage.width()];
        const horizontal = [0, stage.height() / 2, stage.height()];
        (nodes || []).forEach((guideItem) => {
            if (guideItem === skipShape) return
            const box = guideItem.getClientRect();
            vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
            horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
        });
        return {
            vertical,
            horizontal
        };
    };

    const getObjectSnappingEdges = React.useCallback(
        (node: Konva.Shape): SnappingEdges => {
            const box = node.getClientRect();
            const absPos = node.absolutePosition();

            return {
                vertical: [
                    {
                        guide: Math.round(box.x),
                        offset: Math.round(absPos.x - box.x),
                        snap: "start"
                    },
                    {
                        guide: Math.round(box.x + box.width / 2),
                        offset: Math.round(absPos.x - box.x - box.width / 2),
                        snap: "center"
                    },
                    {
                        guide: Math.round(box.x + box.width),
                        offset: Math.round(absPos.x - box.x - box.width),
                        snap: "end"
                    }
                ],
                horizontal: [
                    {
                        guide: Math.round(box.y),
                        offset: Math.round(absPos.y - box.y),
                        snap: "start"
                    },
                    {
                        guide: Math.round(box.y + box.height / 2),
                        offset: Math.round(absPos.y - box.y - box.height / 2),
                        snap: "center"
                    },
                    {
                        guide: Math.round(box.y + box.height),
                        offset: Math.round(absPos.y - box.y - box.height),
                        snap: "end"
                    }
                ]
            };
        },
        []
    );

    const getGuides = React.useCallback(
        (
            lineGuideStops: ReturnType<typeof getLineGuideStops>,
            itemBounds: ReturnType<typeof getObjectSnappingEdges>
        ) => {
            const resultV: Array<{
                lineGuide: number;
                diff: number;
                snap: Snap;
                offset: number;
            }> = [];

            const resultH: Array<{
                lineGuide: number;
                diff: number;
                snap: Snap;
                offset: number;
            }> = [];

            lineGuideStops.vertical.forEach((lineGuide) => {
                itemBounds.vertical.forEach((itemBound) => {
                    const diff = Math.abs(lineGuide - itemBound.guide);
                    if (diff < GUIDELINE_OFFSET) {
                        resultV.push({
                            lineGuide: lineGuide,
                            diff: diff,
                            snap: itemBound.snap,
                            offset: itemBound.offset
                        });
                    }
                });
            });

            lineGuideStops.horizontal.forEach((lineGuide) => {
                itemBounds.horizontal.forEach((itemBound) => {
                    const diff = Math.abs(lineGuide - itemBound.guide);
                    if (diff < GUIDELINE_OFFSET) {
                        resultH.push({
                            lineGuide: lineGuide,
                            diff: diff,
                            snap: itemBound.snap,
                            offset: itemBound.offset
                        });
                    }
                });
            });

            const guides: Array<{
                lineGuide: number;
                offset: number;
                orientation: "V" | "H";
                snap: "start" | "center" | "end";
            }> = [];

            const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
            const minH = resultH.sort((a, b) => a.diff - b.diff)[0];

            if (minV) {
                guides.push({
                    lineGuide: minV.lineGuide,
                    offset: minV.offset,
                    orientation: "V",
                    snap: minV.snap
                });
            }

            if (minH) {
                guides.push({
                    lineGuide: minH.lineGuide,
                    offset: minH.offset,
                    orientation: "H",
                    snap: minH.snap
                });
            }

            return guides;
        },
        []
    );
    const drawGuides = React.useCallback(
        (guides: ReturnType<typeof getGuides>, layer: Konva.Layer) => {
            guides.forEach((lg) => {
                if (lg.orientation === "H") {
                    const line = new Konva.Line({
                        points: [-6000, 0, 6000, 0],
                        stroke: "rgb(0, 161, 255)",
                        strokeWidth: 1,
                        name: "guid-line",
                        dash: [4, 6]
                    });
                    layer.add(line);
                    line.absolutePosition({
                        x: 0,
                        y: lg.lineGuide
                    });
                } else if (lg.orientation === "V") {
                    const line = new Konva.Line({
                        points: [0, -6000, 0, 6000],
                        stroke: "rgb(0, 161, 255)",
                        strokeWidth: 1,
                        name: "guid-line",
                        dash: [4, 6]
                    });
                    layer.add(line);
                    line.absolutePosition({
                        x: lg.lineGuide,
                        y: 0
                    });
                }
            });
        },
        []
    );


    const onDragMove = React.useCallback(
        (e: Konva.KonvaEventObject<DragEvent>, nodes: Konva.Node[]) => {
            const layer = e.target.getLayer() as Konva.Layer;
            // 先清理引导线
            layer.find(".guid-line").forEach((l: Konva.Node) => l.destroy());

            // 计算可能的吸附线
            const lineGuideStops = getLineGuideStops(e.target as Konva.Shape, nodes);

            // 获取当前对象的吸附边界
            const itemBounds = getObjectSnappingEdges(e.target as Konva.Shape);

            // 找到可以吸附的位置
            const guides = getGuides(lineGuideStops, itemBounds);

            if (!guides.length) return

            // 绘制引导线
            drawGuides(guides, layer);

            const absPos = e.target.absolutePosition();
            // 强制设置对象位置
            guides.forEach((lg) => {
                switch (lg.snap) {
                    case "start": {
                        switch (lg.orientation) {
                            case "V": {
                                absPos.x = lg.lineGuide + lg.offset;
                                break;
                            }
                            case "H": {
                                absPos.y = lg.lineGuide + lg.offset;
                                break;
                            }
                        }
                        break;
                    }
                    case "center": {
                        switch (lg.orientation) {
                            case "V": {
                                absPos.x = lg.lineGuide + lg.offset;
                                break;
                            }
                            case "H": {
                                absPos.y = lg.lineGuide + lg.offset;
                                break;
                            }
                        }
                        break;
                    }
                    case "end": {
                        switch (lg.orientation) {
                            case "V": {
                                absPos.x = lg.lineGuide + lg.offset;
                                break;
                            }
                            case "H": {
                                absPos.y = lg.lineGuide + lg.offset;
                                break;
                            }
                        }
                        break;
                    }
                }
            });
            e.target.absolutePosition(absPos);
        },
        [drawGuides, getGuides, getObjectSnappingEdges]
    );

    const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        // 清理引导线
        const layer = e.target.getLayer() as Konva.Layer;
        layer.find(".guid-line").forEach((l: Konva.Node) => l.destroy());
    };

    React.useEffect(() => {
        if (nodes.length) {
            nodes.forEach(node => {
                node.on("dragmove", (e: Konva.KonvaEventObject<DragEvent>) =>
                    onDragMove(e, nodes)
                );
                node.on("dragend", (e: Konva.KonvaEventObject<DragEvent>) =>
                    onDragEnd(e)
                );
            })
        }
    }, [nodes])

    return <></>;
}

export default SmartAlignment;
