export const renameLayer = (layers, index, newName) => {
  const existingLayer = layers.find((layer) => layer.properties.name === newName)

  if (existingLayer) {
    return layers
  }

  return layers.map((layer, i) => {
    if (index !== i) {
      return layer
    }

    return {
      ...layer,
      properties: {
        ...layer.properties,
        name: newName,
      }
    }
  })
}

export const updateLayerProperty = (layers, layerIndex, property, value) => {
  return layers.map((layer, i) => {
    if (i !== layerIndex) {
      return layer
    }

    const newLayer = {
      ...layer,
      properties: {
        ...layer.properties,
      }
    }
    newLayer.properties[property] = value

    return newLayer
  })
}

export const deleteLayer = (layers, index) => {
  const filteredLayers = layers.filter((layer, i) => {
    return i !== index
  })
  return filteredLayers
}

export const mergeLayers = (layers, fromLayerIndex, toLayerIndex) => {
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
          points: [
            ...layer.points,
            ...fromLayer.points,
          ]
        }
      } else {
        return {
          ...layer,
          points: [
            ...fromLayer.points,
            ...layer.points,
          ]
        }
      }
    }

    return layer
  })

  return mergedLayers.filter(layer => layer !== null)
}
