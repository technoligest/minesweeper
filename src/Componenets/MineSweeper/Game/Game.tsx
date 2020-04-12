import './Game.css';

import { Button } from 'primereact/button';
import * as React from 'react';

import { Block, IBlockProps } from '../Block/Block';
import { GameBoardGenerator } from '../GameBoardGenerator';
import { GameOptionsPane } from '../GameOptionsPane/GameOptionsPane';
import { IGameOptions } from '../Interfaces';

export type IGameStatus = "notStarted" | "inProgress" | "lost" | "won";

export interface IGameState {
  readonly grid: IBlockProps[][];
  readonly gameStatus: IGameStatus;
  readonly gameSize: number;
  readonly numMines: number;
  readonly gameStartTime?: Date;
  readonly gameEndTime?: Date;
  readonly timeout?: NodeJS.Timeout;
  readonly gameNumber: number;
  readonly areOptionsOpen: boolean;
  readonly isDebugMode: boolean;
}

export class MineSweeperGame extends React.Component<any, IGameState> {
  private gameBoardGenerator = new GameBoardGenerator();
  constructor(props: any) {
    super(props);
    const gameSize = 10;
    this.state = {
      areOptionsOpen: false,
      gameNumber: 0,
      gameSize,
      gameStatus: "inProgress",
      grid: this.generatePropsGridFromNumbersGrid(this.gameBoardGenerator.generateBoard(gameSize, gameSize, gameSize)),
      isDebugMode: false,
      numMines: gameSize,
    };
    this.setNewOptions = this.setNewOptions.bind(this);
  }

  public render() {
    return (
      <div>
        {this.renderHeader()}
        {this.hiddenGame()}
        {this.state.isDebugMode ? this.renderShownGrid(): <div/>}
      </div>
    );
  }

  private renderHeader() {
    return (
      <div id="header">
        <div id="options-button">
          <Button
            onClick={() => this.setState({areOptionsOpen:true})}
            label={"options"}
            className="p-button-secondary"
          />
          {this.renderGameOptionsPane()}
        </div>
        <div
          id="date-container"
          className={this.state.gameStatus}
          onClick={() => this.setNewOptions({
            gameSize: this.state.gameSize,
            isDebugMode: this.state.isDebugMode,
            numMines: this.state.numMines,
          })}>{this.renderTitle()}
        </div>
      </div>
    );
  }

  private renderGameOptionsPane() {
    const currGameOptions: IGameOptions = {
      gameSize: this.state.gameSize,
      isDebugMode: this.state.isDebugMode,
      numMines: this.state.numMines,
    };
    return (
      <GameOptionsPane
        onClose={() => this.closeOptionsPane()}
        isShown={this.state.areOptionsOpen}
        currGameOptions={currGameOptions}
        onConfirm={this.setNewOptions}
      />
    );
  }

  private generatePropsGridFromNumbersGrid(g: number[][]) {
    return g.map((row, x) => (
      row.map((v, y) => ({
        isPressed: false,
        onClick: () => this.onBlockClicked(x, y),
        value: v,
      }))
    ));
  }

  private renderTitle() {
    switch(this.state.gameStatus) {
      case "lost":
        return ":(";
      case "won":
        return this.getFormattedGameDuration();
      default:
        return this.getDateString();
    }
  }

  private getDateString() {
    return this.getFormattedGameDuration() || ":)";
  }

  private getFormattedGameDuration() {
    if (!this.state.gameStartTime) {
      return undefined;
    }
    const endTime = this.state.gameEndTime || new Date();

    const d = new Date(Math.abs((endTime.getTime() - this.state.gameStartTime.getTime())));
    const seconds = d.getSeconds();
    const minutes = d.getMinutes();

    return this.formatNumber(minutes) + ":" + this.formatNumber(seconds);
  }

  private formatNumber(n: number) {
    if (n < 0) {
      return "00";
    } else if (n < 10) {
      return "0" + n;
    } else {
      return n;
    }
  }

  private onBlockClicked(x: number, y: number) {
    let gameStartTime = this.state.gameStartTime;
    let timeout = this.state.timeout;
    console.log("clicking block!");
    if (!gameStartTime) {
      console.log("starting new game");
      gameStartTime = new Date();
      timeout = setInterval(() => this.setState({}), 1000);
    }  
    const visited = this.getVisitedGridFromBlock(x, y);
    const newGrid = this.pressVisitedBlocks(this.state.grid, visited)
    const gameStatus = this.getGameStatusForGrid(newGrid);
    let gameEndTime: Date | undefined;

    if (this.isGameFinished(gameStatus)) {
      newGrid.forEach(row => row.forEach(val => val.onClick = undefined));
      clearInterval(timeout!);
      timeout = undefined;
      console.log("Finishing game");
      gameEndTime = new Date();
    }

    this.setState({
      gameEndTime,
      gameStartTime,
      gameStatus,
      grid: newGrid,
      timeout,
    });
  }

  private isGameFinished(gameStatus: IGameStatus) {
    return gameStatus !== "inProgress";
  }

  private pressVisitedBlocks(grid: IBlockProps[][], visited: boolean[][]) {
    visited.forEach((row, i) => row.forEach((val, j) => {
      if (val) {
        grid[i][j] = {
          ...grid[i][j],
          isPressed: true,
        };
      }
    }));
    return grid;
  }

  private getGameStatusForGrid(blockProps: IBlockProps[][]): IGameStatus {
    const blocks = blockProps.flat();
    const didWin = blocks.every(block => (block.value<0 && !block.isPressed) || (block.value>=0 && block.isPressed));
    if (didWin) {
      return "won";
    }
    const didLose = blocks.some(block => block.value<0 && block.isPressed);
    if (didLose){
      return "lost";
    }
    return "inProgress";
  }

  private getVisitedGridFromBlock(x: number, y: number) {
    const visited: boolean[][] = this.state.grid.map(v => this.state.grid[0].map(_ => false));
    this.getVisitedGridFromBlockInner(x,y,visited);
    return visited;
  }

  private getVisitedGridFromBlockInner(x: number, y: number, visited: boolean[][]) {
    const grid = this.state.grid;
    if (x<0 || x>=grid.length || y<0 || y>=grid[x].length || grid[x][y].isPressed || visited[x][y]) {
      return;
    }
    visited[x][y] = true;
    if (grid[x][y].value<0) {
      return;
    }
    if (grid[x][y].value === 0) {
      for (let i=-1; i<2; ++i) {
        for (let j=-1; j<2; ++j) {
          this.getVisitedGridFromBlockInner(x+i, y+j, visited);
        }
      }
    }
    return visited;
  }

  private hiddenGame(){
    return (
      <div className="game"
      style={{
        width: 40+30*this.state.gameSize+"px",
      }}>
        {this.state.grid.map((row, i) => (
          <div className="block-row" key={i}>
            {row.map((blockProps, j) => (
              <Block
                {...blockProps}
                key={this.state.gameNumber+"-"+i+"-"+j}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  private renderShownGrid(){
    return (
      <div className="game" style={{
        width: 40+30*this.state.gameSize+"px",
      }}>
        {this.state.grid.map((row, i) => (
          <div className="block-row" key={i}>
            {row.map((blockProps, j) => (
              <Block
                isPressed={true}
                value={blockProps.value}
                key={i+"-"+j}
                onClick={() => {return;}}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  private setNewOptions(gameOptions: IGameOptions) {
    this.setState({
      areOptionsOpen: false,
      gameNumber: this.state.gameNumber + 1,
      gameSize: gameOptions.gameSize,
      gameStartTime: undefined,
      gameStatus: "notStarted",
      grid: this.generatePropsGridFromNumbersGrid(this.gameBoardGenerator.generateBoard(gameOptions.gameSize, gameOptions.gameSize, gameOptions.numMines)),
      isDebugMode: gameOptions.isDebugMode,
      timeout: undefined,
    });
  }

  private closeOptionsPane() {
    this.setState( {
      areOptionsOpen: false,
    });
  }
}


// TODO: add theme
// TODO: Fix issue where numMines = 1 and size = 2. Play one game then try to reset.
// TODO: Fix issue where size of game is too big the game crashes.
// TODO