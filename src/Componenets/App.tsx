import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import './App.css';

import * as React from 'react';
import { Route, Router } from 'react-router-dom';
import { history } from 'src/history';
import { RouterLinks } from 'src/routing/routerLinks';
import { HomePage } from './HomePage/HomePage';
import { MineSweeperGame } from './MineSweeper/Game/Game';
import { TicTacToeGame } from './TicTacToe/TicTacToeGame';

class App extends React.Component {
  public render() {
    return (
      <div id="app">
        <Router history={history}>
          <Route exact={true} path={`/${RouterLinks.HomePage}`} component={HomePage} />
          <Route exact={true} path={`/${RouterLinks.MineSweeper}`} component={MineSweeperGame} />
          <Route exact={true} path={`/${RouterLinks.TicTacToeGame}`} component={TicTacToeGame} />
        </Router>
      </div>
    )
  }
}

export default App;
