import * as React from "react";
import { history } from 'src/history';
import { RouterLinks } from 'src/routing/routerLinks';

interface IPage {
  name: string;
  route: RouterLinks;
}

export class HomePage extends React.Component {
  public render(): JSX.Element {
    const pages: IPage[] = [
      {
        name: "Mine Sweeper",
        route: RouterLinks.MineSweeper,
      },
      {
        name: "TicTacToe",
        route: RouterLinks.TicTacToeGame,
      }
    ];
    return (
      <div id="home-page">
        {pages.map(page => (
          <div
            key={page.name}
            onClick={() => history.push(page.route)}>
            {page.name}
          </div>
        ))}
      </div>
    );
  }
}
