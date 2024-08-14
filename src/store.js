// src/store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // Ensure the correct path to rootReducer

const store = createStore(rootReducer);

export { store };
