import React, { Component } from 'react';
import KanbanBoard from './KanbanBoard';
import update from 'react-addons-update';
import { throttle } from '../utils';
//Polyfills
import 'babel-polyfill';
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: 'any-string-you-like'
};

class KanbanBoardContainer extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      cards: []
    };

    this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
    this.updateCardPosition = throttle(this.updateCardPosition.bind(this), 500);
  }

  componentDidMount() {
    fetch(API_URL + "/cards", {headers: API_HEADERS})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({cards: responseData});
    })
    // .catch((error) -> {
    //   console.log("error fetching and parsing data", error);
    // });
    window.state = this.state;
  }

  addCard(card) {
    let prevState = this.state;

    if (card.id === null) {
      let card = Object.assign({}, card, {id: Date.now()});
    }

    let nextState = update(this.state.cards, { $push: [card] });
    this.setState({cards: nextState});

    fetch(`${API_URL}/cards`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(card)
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error("server response not ok")
      }
    })
    .then((responseData) => {
      card.id = responseData.id
      this.setState({cards: nextState});
    })
    .catch((error) => {
      this.setState(prevState);
    });
  }

  updateCard(card) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((c) => c.id == card.id);
    let nextState = update(this.state.cards, {
      [cardIndex]: { $set: card }
    });
    this.setState({cards: nextState});

    fetch(`${API_URL}/cards/${card.id}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify(card)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("server response not ok")
      }
    })
    .catch((error) => {
      console.error("Fetch error", error)
      this.setState(prevState);
    })
  }

   addTask(cardId, taskName){
    // Keep a reference to the original state prior to the mutations
    // in case you need to revert the optimistic changes in the UI
    let prevState = this.state;

    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);

    // Create a new task with the given name and a temporary ID
    let newTask = {id:Date.now(), name:taskName, done:false};
    // Create a new object and push the new task to the array of tasks
    let nextState = update(this.state.cards, {
                      [cardIndex]: {
                        tasks: {$push: [newTask] }
                      }
                    });

    // set the component state to the mutated object
    this.setState({cards:nextState});

    // Call the API to add the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks`, {
      method: 'post',
      headers: API_HEADERS,
      body: JSON.stringify(newTask)
    })
    .then((response) => {
      if(response.ok){
        return response.json()
      } else {
        // Throw an error if server response wasn’t ’ok’
        // so you can revert back the optimistic changes
        // made to the UI.
        throw new Error("Server response wasn’t OK")
      }
    })
    .then((responseData) => {
      // When the server returns the definitive ID
      // used for the new Task on the server, update it on React
      newTask.id=responseData.id
      this.setState({cards:nextState});
    })
    .catch((error) => {
      this.setState(prevState);
    });
  }

  deleteTask(cardId, taskId, taskIndex){
    let cardIndex = this.state.cards.findIndex((card)=>card.id == cardId);
    let prevState = this.state;

    // Create a new object without the task
    let nextState = update(this.state.cards, {
                      [cardIndex]: {
                        tasks: {$splice: [[taskIndex,1]] }
                      }
                    });

    // set the component state to the mutated object
    this.setState({cards:nextState});

    // Call the API to remove the task on the server
    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'delete',
      headers: API_HEADERS
    })
    .then((response) => {
      if(!response.ok){
        throw new Error("Server response wasn’t OK")
      }
    })
    .catch((error) => {
      console.error("Fetch error:",error)
      this.setState(prevState);
    });
  }

  toggleTask(cardId, taskId, taskIndex) {
    let prevState = this.state;
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let newDoneValue;
    let nextState = update(this.state.cards, {
      [cardIndex]: {
        tasks: {
          [taskIndex]: {
            done: { $apply: (done) => {
              newDoneValue = !done
              return newDoneValue
            }}
          }
        }
      }
    });

    this.setState({cards: nextState});

    fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({done: newDoneValue})
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server response not ok")
      }
    })
    .catch((error) => {
      console.error("Fetch error", error)
      this.setState(prevState);
    });
  }

  updateCardStatus(cardId, listId) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let card = this.state.cards[cardIndex]
    if (card.status !== listId) {
      this.setState(update(this.state, {
        cards: {
          [cardIndex]: {
            status: { $set: listId }
          }
        }
      }));
    }
  }

  updateCardPosition(cardId, afterId) {
    //only proceed if hovering over a different card
    if (cardId !== afterId) {
      let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
      let card = this.state.cards[cardIndex]
      let afterIndex = this.state.cards.findIndex((card) => card.id == afterId);
      //Use to remove card and reinsert it at the new index
      this.setState(update(this.state, {
        cards: {
          $splice: [
            [cardIndex, 1],
            [afterIndex, 0, card]
          ]
        }
      }));
    }
  }

  persistCardDrag(cardId, status) {
    let cardIndex = this.state.cards.findIndex((card) => card.id == cardId);
    let card = this.state.cards[cardIndex]

    fetch(`${API_URL}/cards/${cardId}`, {
      method: 'put',
      headers: API_HEADERS,
      body: JSON.stringify({status: card.status, row_order_position: cardIndex})
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("server response not ok")
      }
    })
    .catch((error) => {
      console.error("Fetch error", error);
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: status }
            }
          }
        })
      );
    });
  }

  render() {
    let kanbanBoard = this.props.children && React.cloneElement(this.props.children, {
      cards: this.state.cards,
      taskCallbacks: {
        toggle: this.toggleTask.bind(this),
        delete: this.deleteTask.bind(this),
        add: this.addTask.bind(this)
      },
      cardCallbacks: {
        addCard: this.addCard.bind(this),
        updateCard: this.updateCard.bind(this),
        updateStatus: this.updateCardStatus,
        updatePosition: this.updateCardPosition,
        persistCardDrag: this.persistCardDrag.bind(this)
      }
    })

    return kanbanBoard;
  }
}

export default KanbanBoardContainer;