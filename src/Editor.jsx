import { useState, useRef } from 'react'
import { Stage, Layer, Text, Line } from 'react-konva'
import PropertiesMenu from './PropertiesMenu'
import LayersMenu from './LayersMenu'
import { deleteLayer, updateLayerProperty } from './utils/layers'
import { startLine, moveLine } from './utils/lines'
import './Editor.css'

const Editor = () => {
  const [tool, setTool] = useState('pen')
  const [layers, setLayers] = useState([])
  const isEditing = useRef(false)
  const [activeLayerIndex, setActiveLayerIndex] = useState(1)

  const activeLayer = layers[activeLayerIndex] || null

  const handleMouseDown = (e) => {
    isEditing.current = true

    let newLayers = layers

    switch (tool) {
      case 'pen':
        newLayers = startLine({ stage: e.target.getStage(), layers })
        setLayers(newLayers)
        setActiveLayerIndex(newLayers.length - 1)
        break
      case 'text':
        const stage = e.target.getStage()
        const point = stage.getPointerPosition()
        newLayers = [
          ...newLayers,
          {
            tool: 'text',
            points: [ point.x, point.y ],
            properties: {
              name: `Text${layers.length + 1}`,
              fontSize: '40',
              fill: '#333',
              text: 'Text',
            },
          }
        ]
        setLayers(newLayers)
        setActiveLayerIndex(newLayers.length - 1)
        break
      default:
        break
    }
  }

  const handleMouseMove = (e) => {
    if (!isEditing.current) {
      return
    }
    switch (tool) {
      case 'pen':
        setLayers(moveLine({
          stage: e.target.getStage(),
          layers,
        }))
        break
      default:
        break
    }
  }

  const handleMouseUp = () => {
    isEditing.current = false
  }

  return (
    <div className="Editor">
      <div className="canvas">
        <Stage
          width={window.innerWidth - 300}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            {layers.map((layer, i) => {
              switch (layer.tool) {
                case 'pen':
                  return (
                    <Line
                      key={i}
                      points={layer.points}
                      stroke={layer.properties.stroke}
                      strokeWidth={layer.properties.strokeWidth}
                      tension={0.5}
                      lineCap="round"
                      globalCompositeOperation="source-over"
                    />
                  )
                case 'text':
                  return (
                    <Text
                      x={layer.points[0]}
                      y={layer.points[1]}
                      fill={layer.properties.fill}
                      fontSize={Number(layer.properties.fontSize)}
                      text={layer.properties.text}
                    />
                  )
                default:
                  return null
              }
            })}
          </Layer>
        </Stage>
        <select
          className="tool-menu"
          value={tool}
          onChange={(e) => {
            setTool(e.target.value);
          }}
        >
          <option value="pen">Pen</option>
          <option value="text">Text</option>
        </select>
      </div>
      <div className="sidebar">
        <LayersMenu
          layers={layers}
          activeLayerIndex={activeLayerIndex}
          selectLayer={setActiveLayerIndex}
          deleteLayer={(index) => {
            setLayers(deleteLayer(layers, index))
          }}
        />
        {!!activeLayer && (
          <PropertiesMenu
            tool={activeLayer.tool}
            toolProps={activeLayer.properties}
            onChange={(property, value) => {
              setLayers(updateLayerProperty(layers, activeLayerIndex, property, value))
            }}
          />
        )}
        {!!layers.length && (
          <div className="download-section">
            <button type="button" className="download" onClick={() => {
              const fileName = window.prompt('File name', layers[0].properties.name)
              const textContent = JSON.stringify(layers)
              const element = document.createElement('a')
              element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(textContent))
              element.setAttribute('download', `${fileName}.json`)
              element.style.display = 'none'
              document.body.appendChild(element)
              element.click()
              document.body.removeChild(element)
            }}>
              Download
              &#x21E9;
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Editor
