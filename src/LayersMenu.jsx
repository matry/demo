import classnames from 'classnames'
import './LayersMenu.css'

const LayersMenu = ({ layers, activeLayerIndex, selectLayer, deleteLayer }) => {
  return (
    <section className="LayersMenu">
      <h3>Layers</h3>
      <ul className="layers">
        {layers.map((layer, index) => (
          <li
            key={layer.properties.name}
            className={classnames(
              'layer',
              {
                active: activeLayerIndex === index
              }
            )}
          >
            <button onClick={() => selectLayer(index)} type="button" className="drag">&#9899;</button>
            <span>{layer.properties.name}</span>
            <button type="button" className="delete" onClick={() => deleteLayer(index)}>&#x274C;</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default LayersMenu
