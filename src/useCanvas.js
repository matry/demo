import { useState, useRef, useEffect } from 'react'

const executeCanvasCommand = (ctx, command) => {
  if (command.properties) {
    Object.entries(command.properties).forEach(([key, value]) => {
      ctx[key] = value
    })
  }

  command.actions.forEach((action) => {
    if (action.params !== null) {
      ctx[action.key](...action.params)
    } else {
      ctx[action.key]()
    }
  })
}

const executeAllCommands = (ctx, layers) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  layers.forEach(layer => {
    layer.commands.forEach(command => executeCanvasCommand(ctx, command))
  })
}

const startDrawing = (e, ctx, canvas) => {
  const rect = canvas.getBoundingClientRect()
  const params = [e.clientX - rect.left, e.clientY - rect.top]

  const command = {
    properties: {
      lineWidth: 10,
      lineCap: 'round',
    },
    actions: [
      {
        key: 'beginPath',
        params: null,
      },
      {
        key: 'moveTo',
        params: params,
      },
    ]
  }

  executeCanvasCommand(ctx, command)

  return command
}

const draw = (e, ctx, canvas) => {
  const rect = canvas.getBoundingClientRect()

  const command = {
    properties: {},
    actions: [
      {
        key: 'lineTo',
        params: [e.clientX - rect.left, e.clientY - rect.top],
      },
      {
        key: 'stroke',
        params: null,
      }
    ],
  }

  executeCanvasCommand(ctx, command)

  return command
}

const stopDrawing = (e, ctx, canvas) => {
  const command = {
    properties: {},
    actions: [
      {
        key: 'beginPath',
        params: null,
      }
    ]
  }

  executeCanvasCommand(ctx, command)

  return command
}

const useCanvas = () => {
  const [draftCommand, setDraftCommand] = useState(null)
  const canvasRef = useRef(null)
  const [layers, setLayers] = useState([])
  const [selectedTool, setSelectedTool] = useState('pencil')
  const [isEditing, setIsEditing] = useState(false)
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    const c = canvasRef.current
    const bounds = c.getBoundingClientRect()
    c.width = bounds.width
    c.height = bounds.height
    setCtx(c.getContext('2d'))

    function keyupListener ({ which }) {
      if (selectedTool !== 'text') {
        return
      }
  
      if (which >= 48 && which <= 90) {
        setDraftCommand({
          ...draftCommand,
          properties: {
            ...draftCommand.properties,
            fontSize: draftCommand.properties + 1
          }
        })
      } else if (which >= 37 && which <= 40) {
        console.log('directional')
      }
    }

    if (selectedTool !== 'text') {
      return
    }

    setDraftCommand({
      properties: {
        fontFamily: 'sans-serif',
        fontSize: 16,
      },
      actions: [
        {
          key: 'drawText',
          params: null,
        }
      ],
    })
    document.addEventListener('keyup', keyupListener)
    return () => document.removeEventListener('keyup', keyupListener)
  }, [selectedTool])

  const renameLayer = (index, title) => {
    const existingLayer = layers.find((layer) => layer.title === title)

    if (existingLayer) {
      return
    }

    setLayers(layers.map((layer, i) => {
      if (index !== i) {
        return layer
      }

      return {
        ...layer,
        title,
      }
    }))
  }

  const deleteLayer = (index) => {
    const filteredLayers = layers.filter((layer, i) => {
      return i !== index
    })
    setLayers(filteredLayers)
    executeAllCommands(ctx, filteredLayers)
  }

  const mergeLayers = (fromLayerIndex, toLayerIndex) => {
    if (fromLayerIndex === toLayerIndex) {
      return
    }

    const fromLayer = {...layers[fromLayerIndex]}
    const mergedLayers = layers.map((layer, index) => {
      if (index === fromLayerIndex) {
        return null
      }

      if (index === toLayerIndex) {
        if (fromLayerIndex > toLayerIndex) {
          return {
            ...layer,
            commands: [
              ...layer.commands,
              ...fromLayer.commands,
            ]
          }
        } else {
          return {
            ...layer,
            commands: [
              ...fromLayer.commands,
              ...layer.commands,
            ]
          }
        }
      }

      return layer
    })

    const mergedAndFilteredLayers = mergedLayers.filter(layer => layer !== null)
    setLayers(mergedAndFilteredLayers)
    executeAllCommands(ctx, mergedAndFilteredLayers)
  }

  const switchTool = (e) => {
    setSelectedTool(e.target.id)
  }

  const onPress = (e) => {
    if (!ctx) {
      return
    }

    ctx.save()

    switch (selectedTool) {
      case 'pencil':
        setDraftCommand(startDrawing(e, ctx, canvasRef.current))
        break
      default:
        break
    }

    setIsEditing(true)
  }

  const onMove = (e) => {
    if (!isEditing || !ctx || !draftCommand) {
      return
    }

    let moveCommand = {}

    switch (selectedTool) {
      case 'pencil':
        moveCommand = draw(e, ctx, canvasRef.current)
        break
      default:
        break
    }

    setDraftCommand({
      properties: {
        ...draftCommand.properties,
        ...moveCommand.properties,
      },
      actions: [
        ...draftCommand.actions,
        ...moveCommand.actions,
      ]
    })
  }

  const onRelease = (e) => {
    if (!ctx || !draftCommand || !isEditing) {
      return
    }

    let releaseCommand = {}

    switch (selectedTool) {
      case 'pencil':
        releaseCommand = stopDrawing(e, ctx, canvasRef.current)
        break
      default:
        break
    }


    setIsEditing(false)

    setLayers([
      ...layers,
      {
        title: `Shape${layers.length + 1}`,
        commands: [
          {
            properties: {
              ...draftCommand.properties,
              ...releaseCommand.properties,
            },
            actions: [
              ...draftCommand.actions,
              ...releaseCommand.actions,
            ]
          }
        ]
      }
    ])
  }

  return {
    ref: canvasRef,
    layers,
    renameLayer,
    deleteLayer,
    mergeLayers,
    selectedTool,
    switchTool,
    onMove,
    onPress,
    onRelease,
  }
}

export default useCanvas
