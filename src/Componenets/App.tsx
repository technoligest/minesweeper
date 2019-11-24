import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import './App.css';

import * as React from 'react';

import { MineSweeperGame } from './MineSweeper/Game/Game';

// import { BrowserRouter, Route } from 'react-router-dom';
// import { MineSweeperGame } from './MineSweeper/Game/Game';
// import { TicTacToeGame } from './TicTacToe/TicTacToeGame';

class App extends React.Component {
  public render() {
    return (
      // <BrowserRouter>
      //   <Route path="/" component={Game}/>
      // </BrowserRouter>
      <MineSweeperGame
        time={new Date()}
      />
      // <TicTacToeGame boardSize={3}/>
    );
  }
}

export default App;
