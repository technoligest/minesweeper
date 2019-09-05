import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from 'redux';

import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import App from './Componenets/App';
import { history } from './history';
import registerServiceWorker from './registerServiceWorker';
import { rootReducer } from './State/Reducers/rootReducer';

const loggerMiddleware = createLogger();

const store = createStore(rootReducer, applyMiddleware(loggerMiddleware, thunk));
ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
