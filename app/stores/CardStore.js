import AppDispatcher from '../AppDispatcher';
import constants from '../constants';
import { ReduceStore } from 'flux/utils';

class CardStore extends ReduceStore {
  getInitialState() {
    return [];
  }

  reduce(state, action) {
    switch (actiontype) {
      default:  
        return state;
    }
  }
}

export default new CardStore(AppDispatcher);