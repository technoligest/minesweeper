import './index.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './Componenets/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  // <Router history={history}>
    <App />,
    // </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
