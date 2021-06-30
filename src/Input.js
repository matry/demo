import { useState, useEffect } from 'react'

const Input = ({ restrictedChars, value, onChange }) => {
  const [currentValue, setCurrentValue] = useState('')

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  return (
    <input
      type="text"
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={() => {
        if (currentValue === null || currentValue === undefined) {
          return
        }

        if (restrictedChars && currentValue.includes && currentValue.includes(restrictedChars)) {
          setCurrentValue(value)
          return
        }

        onChange(currentValue)
      }}
    />
  )
}

export default Input
