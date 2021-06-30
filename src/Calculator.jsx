import { useState } from 'react'
import component from './component.json'
import Matry from './Matry'

const executeOperation = (operation, leftOperand, rightOperand) => {
  switch (operation) {
    case 'plus':
      return leftOperand + rightOperand
    case 'minus':
      return leftOperand - rightOperand
    default:
      return rightOperand
  }
}

const Calculator = () => {
  const [result, setResult] = useState(0)
  const [operation, setOperation] = useState(null)

  return (
    <div>
      <Matry
        component={component}
        input={{
          OneButton: () => {
            setResult(executeOperation(operation, result, 1))
          },
          TwoButton: () => {
            setResult(executeOperation(operation, result, 2))
          },
          ThreeButton: () => {
            setResult(executeOperation(operation, result, 3))
          },
          PlusButton: () => {
            setOperation('plus')
          },
          MinusButton: () => {
            setOperation('minus')
          }
        }}
        output={{
          Result: result,
        }}
      />
    </div>
  )
}

export default Calculator
