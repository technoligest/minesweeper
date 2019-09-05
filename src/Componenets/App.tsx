import * as React from 'react';
import './App.css';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';

// import { BrowserRouter, Route } from 'react-router-dom';
import { Game } from './Game/Game';

class App extends React.Component {
  public render() {
    return (
      // <BrowserRouter>
      //   <Route path="/" component={Game}/>
      // </BrowserRouter>
      <Game
        time={new Date()}
      />
    );
  }
}

export default App;
