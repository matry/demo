import { Stage, Layer, Text, Line } from 'react-konva'
import IOReceiver from './IOReceiver'

const Matry = ({ component, input, output }) => {
  return (
    <div className="Matry">
      {!component && (<IOReceiver input={input} output={output} />)}
      {!!component && (
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            {component.map((layer, i) => {
              const props = { ...layer.properties }
              switch (layer.tool) {
                case 'pen':
                  props.points = layer.points
                  break
                case 'text':
                  props.x = layer.points[0]
                  props.y = layer.points[1]
                  break
                default:
                  break
              }

              const name = layer.properties.name

              if (input[name] && typeof input[name] === 'function') {
                props.onClick = input[name]
              }

              if (output[name]) {
                props.text = output[name]
              }

              switch (layer.tool) {
                case 'pen':
                  return (
                    <Line
                      key={i}
                      {...props}
                      hitFunc={(context, shape) => {
                        // Well this is fucking stupid
                        let minX = 9999999
                        let minY = 9999999
                        for (let i = 0, l = layer.points.length; i < l; i += 2) {
                          const x = layer.points[i]
                          const y = layer.points[i + 1]
                          minX = Math.min(minX, x)
                          minY = Math.min(minY, y)
                        }

                        context.beginPath()
                        context.rect(minX, minY, shape.width(), shape.height())
                        context.closePath()
                        context.fillStrokeShape(shape)
                      }}
                    />
                  )
                case 'text':
                  return <Text key={i} {...props} />
                default:
                  return null
              }
            })}
          </Layer>
        </Stage>
      )}
    </div>
  )
}

export default Matry
