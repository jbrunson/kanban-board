import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, IndexLink } from 'react-router';
import KanbanBoardContainer from '../KanbanBoardContainer';
import About from '../About';
import Repos from '../Repos';
import RepoDetails from '../RepoDetails'

class App extends Component {
  render() {
    return (
      <div>
        <header>App</header>
        <menu>
          <ul>
            <li><IndexLink to="/" activeClassName="active">Home-kanban</IndexLink></li>
            <li><Link to="/about" activeClassName="active">About</Link></li>
            <li><Link to="/repos" activeClassName="active">Repos</Link></li>
          </ul>
        </menu>
        {this.props.children}
      </div>
    );
  }
}

render(
  (
    <Router>
      <Route path="/" component={App}>
        <IndexRoute component={KanbanBoardContainer} />
        <Route path="about" component={About} />
        <Route path="repos" component={Repos}>
          <Route path="/repo/:repo_name" component={RepoDetails} />
        </Route>
      </Route>
    </Router>
  ), document.getElementById('root'));