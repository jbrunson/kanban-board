import React, { Component } from 'react';
import { render } from 'react-dom';

import { Router, Route, Link, IndexRoute, IndexLink } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import KanbanBoardContainer from '../KanbanBoardContainer';
import KanbanBoard from '../KanbanBoard';
import About from '../About';
import Repos from '../Repos';
import RepoDetails from '../RepoDetails';
import ServerError from '../ServerError';
import EditCard from '../EditCard';
import NewCard from '../NewCard';

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

render((
  <Router history={createBrowserHistory()}>
    <Route component={KanbanBoardContainer}>
      <Route path="/" component={KanbanBoard}>
        <Route path="new" component={NewCard} />
        <Route path="edit/:card_id" component={EditCard} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'));

// render(
//   (
//     <Router history={createBrowserHistory()}>
//       <Route path="/" component={App}>
//         <IndexRoute component={KanbanBoardContainer} />
//         <Route path="about" component={About} title="About Us" />
//         <Route path="repos" component={Repos}>
//           <Route path="/repo/:repo_name" component={RepoDetails} />
//         </Route>
//         <Route path="error" component={ServerError} />
//       </Route>
//     </Router>
//   ), document.getElementById('root'));