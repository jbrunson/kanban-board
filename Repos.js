import React, { Component } from 'react';
import 'whatwg-fetch';
import { Link } from 'react-router';

class Repos extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      repositories: []
    };
  }

  componentDidMount() {
    fetch('https:api.github.com/users/pro-react/repos')
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("server response not ok");
      }
    })
    .then((responseData) => {
      this.setState({repositories: responseData});
    })
    .catch((error) => {
      this.props.history.pushState(null, '/error');
    });
  }
  
  render() {
    let repos = this.state.repositories.map((repo) => (
      <li key={repo.id}>
        <Link to={"/repo/" + repo.name}>{repo.name}</Link>
      </li>
    ));
    return (
      <div>
        <h1>Github repos</h1>
        <ul>
          {repos}
        </ul>
        {this.props.children}
      </div>
    );
  }
}

export default Repos;