import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';
import './css/semantic.min.css';

const Route = ({path, component}, {location}) => { //stateless component, get context object from second argument
  const pathname = location.pathname
  if (pathname.match(path)) {
    return (
      React.createElement(component)
    )
  } else {
    return null
  }
}

Route.contextTypes = {
  location: PropTypes.object
}

const Link = ({to, children}, {history}) => ( //stateless component, get context object from second argument
  <a
    onClick={(e) => {
      e.preventDefault();
      history.push(to);
    }}
    href={to}
  >
    {children}
  </a>
)

Link.contextTypes = {
  history: PropTypes.object
}

const Atlantic = () => ( //stateless component
  <div>
    <h3>Atlantic Ocean</h3>
    <p>
      The Atlantic Ocean covers approximately 1/5th of the surface of the earth.
    </p>
  </div>
)

const Pacific = () => ( //stateless component
  <div>
    <h3>Pacific Ocean</h3>
    <p>
      Ferdnand Magellan, a Portuguese explorer, named the ocean 'mar pacifico' in 1521, which means peaceful sea.
    </p>
  </div>
)

class BlackSea extends Component {
  state = {
    counter: 3
  }

  componentDidMount() {
    this.interval = setInterval(() => (
      this.setState(prevState => {
        return {
          counter: prevState.counter - 1
        }
      })
    ), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <h3>Black Sea</h3>
        <p>Nothing to sea [sic] here... </p>
        <p>Redirecting in {this.state.counter}... </p>
        {
          (this.state.counter < 1) ? (
            <Redirect to='/' />
          ) : null
        }
      </div>
    )
  }
}

class Redirect extends Component {
  static contextTypes = {
    history: PropTypes.object
  }

  componentDidMount() {
    const history = this.context.history  //get context object in stateful component
    const to = this.props.to
    history.push(to)
  }

  render() {
    return null
  }
}

class Router extends Component {
  static childContextTypes = {
    history: PropTypes.object,
    location: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.history = createHistory()
    this.history.listen(() => this.forceUpdate())
  }

  getChildContext() { //define context object will pass down to all children components
    return {
      history: this.history,
      location: window.location
    }
  }

  render() {
    return this.props.children
  }
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className='ui text container'>
          <h2 className='ui dividing header'>
            Which body of water?
          </h2>

          <ul>
            <li>
              <Link to='/atlantic'>
                <code>/atlantic</code>
              </Link>
            </li>
            <li>
              <Link to='/pacific'>
                <code>/pacific</code>
              </Link>
            </li>
            <li>
              <Link to='/black-sea'>
                <code>/black-sea</code>
              </Link>
            </li>
          </ul>

          <hr />

          <Route path='/atlantic' component={Atlantic} />
          <Route path='/pacific' component={Pacific} />
          <Route path='/black-sea' component={BlackSea} />
        </div>
      </Router>
    );
  }
}

export default App;
