import React, { Component } from 'react';
import TaskActionCreators from '../actions/TaskActionCreators';

class CheckList extends Component {
  checkInputKeyPress(evt) {
    if (evt.key === 'Enter') {
      let newTask = {id: Date.now(), name: evt.target.value, done: false};
      TaskActionCreators.addTask(this.props.cardId, newTask);
      evt.target.value = '';
    }
  }

  render() {
    let tasks = this.props.tasks.map((task, taskIndex) => (
      <li key={task.id} className="checklist__task">
        <input type="checkbox" checked={task.done} onChange={
          TaskActionCreators.toggleTask.bind(null, this.props.cardId, task.id, taskIndex)
        } />
        {task.name}{' '}
        <a href="#" className="checklist__task--remove" onClick={
          TaskActionCreators.deleteTask.bind(null, this.props.cardId, task.id, taskIndex)
        } />
      </li>
    ));

    return (
      <div className="checklist">
        <ul>{tasks}</ul>
        <input type="text"
               className="checklist--add-task"
               placeholder="type then enter to add task"
               onKeyPress={this.checkInputKeyPress.bind(this)} />
      </div>
    );
  }
}

export default CheckList;