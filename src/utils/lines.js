export const startLine = ({ stage, layers }) => {
  const point = stage.getPointerPosition()
  return [
    ...layers,
    {
      tool: 'pen',
      properties: {
        name: `Line${layers.length + 1}`,
        stroke: '#333',
        strokeWidth: 5,
      },
      points: [ point.x, point.y ]
    }
  ]
}

export const moveLine = ({ stage, layers }) => {
  const point = stage.getPointerPosition()
  const lastLine = layers[layers.length - 1]
  lastLine.points = lastLine.points.concat([point.x, point.y])
  const results = [...layers]
  results.splice(results.length - 1, 1, lastLine)

  return results.concat()
}
