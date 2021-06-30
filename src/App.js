import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Editor from './Editor'
import Calculator from './Calculator'
import Counter from './Counter'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/editor" component={Editor} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/counter" component={Counter} />
          <Route path="/">
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/editor">Editor</Link>
                  </li>
                  <li>
                    <Link to="/counter">Counter Demo</Link>
                  </li>
                  <li>
                    <Link to="/calculator">Calculator Demo</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
