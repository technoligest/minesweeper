import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import './App.css';

import * as React from 'react';
import { Route } from 'react-router-dom';

import { HomePage } from './HomePage/HomePage';
import { MineSweeperGame } from './MineSweeper/Game/Game';
import { TicTacToeGame } from './TicTacToe/TicTacToeGame';

class App extends React.Component {
  public render() {
    return (
      <div id="app">
        <Route exact={true} path="/" component={HomePage}/>
        <Route exact={true} path="/minesweeper" component={MineSweeperGame}/>
        <Route exact={true} path="/tictactoe" component={TicTacToeGame}/>
      </div>
    );
  }
}

export default App;
