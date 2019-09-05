import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';

import { InputText } from 'primereact/inputtext';
import * as React from 'react';
import { Block, IBlockProps } from '../Block/Block';
import './Game.css';

import * as Utils from "../../Utils/Utils";

export interface IGameProps {
  readonly time: Date;
}

export type IGameStatus = "inProgress" | "lost" | "won";

export interface IGameState {
  readonly grid: IBlockProps[][];
  readonly gameStatus: IGameStatus;
  readonly gameSize: number;
  readonly numMines: number;
  readonly gameStartTime?: Date;
  readonly timeout?: NodeJS.Timeout;
  readonly gameNumber: number;
  readonly areOptionsOpen: boolean;
  readonly isDebugMode: boolean;
}

export class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);
    const gameSize = 10;
    this.state = {
      areOptionsOpen: false,
      gameNumber: 0,
      gameSize,
      gameStatus: "inProgress",
      grid: this.generatePropsGridFromNumbersGrid(this.generateNumbersGrid(gameSize, gameSize, gameSize)),
      isDebugMode: false,
      numMines: gameSize,
    };
    this.setGameWithParameters = this.setGameWithParameters.bind(this);
    this.hideOptionsPane = this.hideOptionsPane.bind(this);
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

  private hideOptionsPane() {
    this.setState({areOptionsOpen: false});
  }

  private renderHeader() {
    return (
      <div id="header">
        {this.renderOptionsButton()}
        <div
          id="date-container"
          className={this.state.gameStatus}
          onClick={this.setGameWithParameters}>{this.renderTitle()}</div>
      </div>
    );
  }

  private setGameWithParameters() {
    this.setState({
      gameNumber: this.state.gameNumber + 1,
      gameStartTime: undefined,
      gameStatus: "inProgress",
      grid: this.generatePropsGridFromNumbersGrid(this.generateNumbersGrid(this.state.gameSize, this.state.gameSize, this.state.numMines)),
      timeout: undefined,
    });
  }

  private renderOptionsButton() {
    return (
      <div id="options-button">
        <Button onClick={() => this.setState({areOptionsOpen:true})} label={"options"} className="p-button-secondary"/>
        <Dialog
          header="Options"
          visible={this.state.areOptionsOpen}
          style={{width: '50vw'}}
          modal={true}
          onHide={this.hideOptionsPane}>
        {this.renderOptions()}
        </Dialog>
      </div>
    );
  }
  private renderOptions() {
    return(
      <div className="options">
        <div className="option-container">
          <div className="option-label">Game size:</div>
          <InputText type="text" keyfilter="pint" value={this.state.gameSize} onChange={(e) => this.setState({gameSize: (e.target as any).value})} />
        </div>
        <div className="option-container">
          <div className="option-label">Number of mines:</div>
          <InputText type="text" keyfilter="pint" value={this.state.numMines} onChange={(e) => this.setState({numMines: (e.target as any).value})} />
        </div>
        <div className="option-container">
          <div className="option-label">Cheat Mode:</div>
          <Checkbox checked={this.state.isDebugMode} onChange={() => this.setState({isDebugMode: !this.state.isDebugMode})}/>
        </div>
        <br/>
        <Button onClick={() => {
          this.setGameWithParameters();
          this.hideOptionsPane();
        }}
        label={"Save options"}/>
      </div>
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
    const date = this.state.gameStartTime
      ? new Date(Math.abs((new Date().getTime() - this.state.gameStartTime.getTime())))
      : undefined;
    const dateString = date
      ? date.getMinutes()+":"+date.getSeconds()
      : ":)";
    switch(this.state.gameStatus) {
      case "lost":
        return ":(";
      case "won":
      default:
        return dateString;
    }
  }

  private onBlockClicked(x: number, y: number) {
    if (!this.state.gameStartTime) {
      this.startGameTimer();
    }  
    const visited = this.getVisitedGridFromBlock(x, y);
    const newGrid = this.pressVisitedBlocks(this.state.grid, visited)
    const gameStatus = this.getGameStatusForGrid(newGrid);
    if (this.isGameFinished(gameStatus)) {
      newGrid.forEach(row => row.forEach(val => val.onClick = undefined));
      this.endGameTimer();
    }
    this.setState({
      gameStatus,
      grid: newGrid,
    });
  }

  private isGameFinished(gameStatus: IGameStatus) {
    return gameStatus !== "inProgress";
  }

  private endGameTimer() {
    clearInterval(this.state.timeout!);
    this.setState({
      timeout: undefined,
    });
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

  private startGameTimer() {
    this.setState({
      gameStartTime: new Date(),
      timeout: setInterval(() => this.setState({}),1000),
    });
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
                onClick={Utils.emptyFunction}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  private generateNumbersGrid(rows: number, cols: number, numMines: number): number[][]{
    const mineLocations = this.generateMineLocations(rows, cols, numMines);
    const grid = this.generateEmptyGrid(rows, cols);
    // tslint:disable-next-line
    for(const prop in mineLocations){
      const v = mineLocations[prop];
      v.forEach(loc => {
        grid[prop][loc] = -1;
        for(let i=-1; i<2; ++i) {
          for(let j=-1; j<2; ++j) {
            const x = +prop + i;
            const y = j+loc;
            if (x<0 || y<0 || x>=rows || y>=cols || this.contains(mineLocations, x, y)) {
              continue;
            }
            grid[x][y]++;
          }
        }
      });
    }
    return grid;
  }

  private generateMineLocations(rows: number, cols: number, numberOfMines: number) {
    const map: {[key: number]: number[]} = {};
    if (numberOfMines > rows*cols) {
      throw Error("You're an idiot.");
    }
    for (let i = 0; i<numberOfMines; ++i) {
      let x: number;
      let y: number;
      do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
      } while(this.contains(map, x, y));
      if (map[x]) {
        map[x].push(y);
      } else {
        map[x] = [y];
      }
    }

    return map;
  }

  private contains(map: {[key: number]: number[]}, x: number, y: number) {
    if (!map[x]) {
      return false;
    } 
    return map[x].find(v => v === y) !== undefined;
  }

  private generateEmptyGrid(rows: number, cols: number):number[][] {
    const grid:number [][] = [];
    for(let i=0; i<rows; ++i) {
      grid[i]=[];
      for(let j=0; j<cols; ++j) {
        grid[i].push(0);
      }
    }
    return grid;
  }
}
