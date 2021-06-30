import { Fragment } from 'react'
import Input from './Input'
import './PropertiesMenu.css'

const PROPERTIES = {
  pen: [
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'strokeWidth',
      title: 'Size',
    },
    {
      id: 'stroke',
      title: 'Color'
    },
  ],
  text: [
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'text',
      title: 'Text Content',
    },
    {
      id: 'fontSize',
      title: 'Size',
    },
    {
      id: 'fill',
      title: 'Color',
    },
  ]
}

const PropertiesMenu = ({ tool, toolProps, onChange }) => {
  return (
    <section className="PropertiesMenu">
      <h3>{toolProps.name} Attributes</h3>
      <div className="properties">
        {PROPERTIES[tool].map((property, i) => (
          <Fragment key={`property-${property.id}-${i}`}>
            <label>{property.title}</label>
            <Input restrictedChars=" " value={toolProps[property.id]} onChange={(value) => {
              onChange(property.id, value)
            }} />
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export default PropertiesMenu
