import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List';
import { Link } from 'react-router';

class KanbanBoard extends Component {
  render() {
    let cardModal = this.props.children && React.cloneElement(this.props.children, {
      cards: this.props.cards,
      cardCallbacks: this.props.cardCallbacks
    });

    return (
      <div className='app'>
        <Link to="/new" className="float-button">+</Link>

        <List id='todo' title='To Do' taskCallbacks={this.props.taskCallbacks}
                                      cards={this.props.cards.filter((card) => card.status === "todo") }
                                      cardCallbacks={this.props.cardCallbacks} />

        <List id='in-progress' title='In Progress' taskCallbacks={this.props.taskCallbacks}
                                      cards={this.props.cards.filter((card) => card.status === "in-progress") }
                                      cardCallbacks={this.props.cardCallbacks} />

        <List id='done' title='Done' taskCallbacks={this.props.taskCallbacks}
                                      cards={this.props.cards.filter((card) => card.status === "done") }
                                      cardCallbacks={this.props.cardCallbacks} />

        {cardModal}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(KanbanBoard);