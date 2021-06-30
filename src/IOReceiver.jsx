import './IOReceiver.css'

const IOReceiver = ({ input, output }) => {
  return (
    <div className="IOReceiver">
      <h2>Input</h2>
      <ul className="input">
        {Object.entries(input).map(([key, fn]) => (
          <li key={key}>
            <button type="button" onClick={fn}>{key}</button>
          </li>
        ))}
      </ul>
      <h2>Output</h2>
      <ul className="output">
        {Object.entries(output).map(([key, text]) => (
          <li className="output" key={key}>
            <span>{key}: </span> {text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IOReceiver
