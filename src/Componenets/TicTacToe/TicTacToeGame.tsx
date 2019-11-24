import './TicTacToeGame.css';

import { Button } from 'primereact/button';
import * as React from 'react';

type WinType = "row" | "col" | "diag";
interface IWinObject {
  winType: WinType;
  winner: Player;
  position: number;
}
interface IPossibleWinCollection {
  type: WinType;
  items: BoxValue[];
  position: number;
}
type Player = "X" | "O";
type BoxValue = Player | undefined;
type Board = BoxValue[][];

export interface ITicTacToeGameProps {
  readonly boardSize: number;
}

export interface ITicTacToeGameState {
  readonly board: Board;
  readonly turnOf: Player;
  readonly winner?: IWinObject;
}

export class TicTacToeGame extends React.Component<ITicTacToeGameProps, ITicTacToeGameState> {
  constructor(props: ITicTacToeGameProps) {
    super(props);
    this.state = this.getInitialGameState(props.boardSize);
    this.onClickBox = this.onClickBox.bind(this);
  }

  public render() {
    return (
      <>
        {this.renderWinner()}
        {this.renderResetButton()}
        {this.renderBoard()}
      </>
    )
  }

  private renderWinner() {
    return (
      <div className="winner-container">
        The winner is: {this.state.winner}
      </div>
    )
  }
  private renderResetButton() {
    return (
      <Button
        onClick={() => this.setState(this.getInitialGameState(this.props.boardSize))}
        label={"reset"}
      />
    )
  }

  private renderBoard() {
    const boxSize = 50;
    const width = this.props.boardSize*boxSize;
    const margin = `calc((100vw - ${width}px) / 2)`;
    const innerContainerStyles = {
      marginLeft: margin,
      marginRight: margin,
      width,
    };
    const horizontaLineStyle = {
      borderTop: "5px solid red",
      display: this.state.winner ? "block" : "none",
      left: margin,
      position: "absolute" as "absolute",
      top: (.5+2)*boxSize, // TODO: Add real value
      width,
    };
    const verticalLineStyle = {
      borderLeft: "5px solid red",
      display: this.state.winner ? "block" : "none",
      height: width,
      left: `calc((100vw - ${width}px) / 2 + ${(.5+1)*boxSize}px)`,
      position: "absolute" as "absolute",
      top: 0,
    };
    console.log(horizontaLineStyle, verticalLineStyle);
    const diagnalHeight = Math.sqrt(2*width*width);
    const diagnalLineStyle = {
      borderLeft: "5px solid red",
      display: this.state.winner ? "block" : "none",
      height: diagnalHeight,
      left: `calc((100vw - ${width}px) / 2 + ${(.5+1)*boxSize}px)`,
      position: "absolute" as "absolute",
      top: -1* ((diagnalHeight-width)/2),
      transform: "rotate(-45deg)"
    };
    const lineStyle = this.state.winner
      ? this.state.winner.winType === "diag" ? diagnalLineStyle
        : this.state.winner.winType === "row" ? horizontaLineStyle
        : this.state.winner.winType === "col" ? verticalLineStyle
        : undefined
      : undefined;
    return (
      <div id="tictactoeboard">
        <div style={innerContainerStyles}>
          {this.state.board.map((row, x) => (
            <div className="row">
              {row.map((box, y) => this.renderBox(box, x, y))}
            </div>
          ))}
        </div>
        <div style={lineStyle}/>
      </div>
    );
  }

  private renderBox(val: BoxValue, x: number, y: number) {
    return (
      <div
        className={`box ${val} ${!this.state.winner && !val && "clickable"}`}
        onClick={() => !this.state.winner && this.onClickBox(x, y)}>
        {val}
      </div>
    );
  }

  private onClickBox(x: number, y: number) {
    const board = this.state.board;
    if (board[x][y] !== undefined) {
      return;
    }
    board[x][y] = this.state.turnOf;
    const winner = this.getWinner(board);
    this.setState({
      board,
      turnOf: this.state.turnOf === "O" ? "X" : "O",
      winner,
    })
  }

  private getInitialGameState(boardSize: number): ITicTacToeGameState {
    const board = [];
    for(let i=0; i<boardSize; ++i) {
      const row = [];
      for(let j=0; j<boardSize; ++j) {
        row.push(undefined);
      }
      board.push(row);
    }
    return {
      board,
      turnOf: "X",
      winner: undefined,
    };
  }

  private getWinner(board: Board): IWinObject | undefined {
    const rows: IPossibleWinCollection[] = board.map((row, rowPos) => ({
      items: row,
      position: rowPos,
      type: "row",
    }));
    const cols = this.getCols(board);
    const diags = this.getDiags(board);
    const arrs = [
      ...rows,
      ...cols,
      ...diags,
    ];
    const winningRow = arrs.find(row => this.getValueOfWinner(row));

    return winningRow ? winningRow[0] : undefined;
  }

  private getCols(board: Board): IPossibleWinCollection[] {
    const resultBoard: Board = board.map(() => []);
    board.forEach((row) => row.forEach((col, colNum ) => resultBoard[colNum].push(col)));

    return resultBoard.map((col, position) => ({
      items: col,
      position,
      type: "row",
    }));
  }

  private getDiags(board: Board): IPossibleWinCollection[] {
    return [
      {
        items: board.map((row, rowNum) => board[rowNum][rowNum]),
        position: 0,
        type: "diag",
      },
      {
        items: board.map((row, rowNum) => board[rowNum][board.length-rowNum-1]),
        position: 0,
        type: "diag",
      },
    ];
  }

  private getValueOfWinner(collection: IPossibleWinCollection): IWinObject | undefined {
    if (collection.items.length === 0) {
      return;
    }

    return collection.items.every(item => !!item && item === collection.items[0])
      ? {
        position: collection.position,
        winType: collection.type,
        winner: collection.items[0]!, // TODO: fix
      }
      : undefined;
  }
}
