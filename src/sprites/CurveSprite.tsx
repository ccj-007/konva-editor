import React, { useRef, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import useStore from '../store'
import { ShapeProps } from '../types/sprite'
import Konva from 'konva'

const CurveSprite: React.FC<{
  shapeProps: ShapeProps
  onSelect: () => void
}> = React.forwardRef(
  ({ shapeProps, onSelect, onChange }, line: MutableRefObject<Konva.Line>) => {
    const { drawSpriteType, stage } = useStore()

    const handleMouseDown = (e) => {
      const stage = e.target.getStage()
      const pointer = stage.getPointerPosition()
      const linePos = (line.current as Konva.Line).getAbsolutePosition()
      const newPoints = [
        ...line.current.attrs.points,
        pointer.x - linePos.x,
        pointer.y - linePos.y,
      ]

      console.log(newPoints)

      line.current.attrs.points = newPoints

      //   if (newPoints.length > 3) {
      //     line.current.points(getBezierCurvePoints(newPoints))
      //   }
    }

    const getBezierCurvePoints = (points) => {
      const controlPoints = []
      for (let i = 0; i < points.length - 2; i += 2) {
        const x1 = points[i]
        const y1 = points[i + 1]
        const x2 = points[i + 2]
        const y2 = points[i + 3]
        const cx = (x1 + x2) / 2
        const cy = (y1 + y2) / 2
        controlPoints.push(cx, cy)
      }

      const bezierPoints = []
      for (let i = 0; i < controlPoints.length - 2; i += 2) {
        const x1 = controlPoints[i]
        const y1 = controlPoints[i + 1]
        const x2 = controlPoints[i + 2]
        const y2 = controlPoints[i + 3]
        for (let t = 0; t <= 1; t += 0.1) {
          const bx = getBezierValue(t, x1, x2)
          const by = getBezierValue(t, y1, y2)
          bezierPoints.push(bx, by)
        }
      }

      return bezierPoints
    }

    const getBezierValue = (t, p1, p2) => {
      const u = 1 - t
      const tt = t * t
      const uu = u * u
      const uuu = uu * u
      const ttt = tt * t

      const value = uuu * p1 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p2
      return value
    }

    React.useEffect(() => {
      if (drawSpriteType === 'CURVE') {
        stage?.on('mousedown', handleMouseDown)
      }
    }, [drawSpriteType])

    return (
      <Line
        onClick={onSelect}
        onTap={onSelect}
        ref={line}
        draggable
        {...shapeProps}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={() => {}}
      />
    )
  }
)

export default CurveSprite
