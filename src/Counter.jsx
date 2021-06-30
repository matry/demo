import { useState } from 'react'
import Matry from './Matry'
import design from './Counter-Design.json'

const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <Matry
      component={design}
      input={{
        CounterButton: () => {
          setCount(count + 1)
        },
      }}
      output={{
        Count: count,
      }}
    />
  )
}

export default Counter
