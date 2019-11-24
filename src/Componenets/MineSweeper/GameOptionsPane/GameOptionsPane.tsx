import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import * as React from 'react';
import { IGameOptions } from '../Interfaces';

export interface IOptionsPaneProps {
  onClose: () => void;
  isShown: boolean;
  currGameOptions: IGameOptions;
  onConfirm: (gameOptions: IGameOptions) => void;
}

export interface IOptionsPaneState {
  gameOptions: IGameOptions;
}

export class GameOptionsPane extends React.Component<IOptionsPaneProps, IOptionsPaneState> {
  public constructor(props: IOptionsPaneProps) {
    super(props);
    this.state = {
      gameOptions: props.currGameOptions,
    };
  }

  public render() {
    return (
      <Dialog
        header="Options"
        visible={this.props.isShown}
        style={{width: '50vw'}}
        modal={true}
        onHide={this.props.onClose}>
        {this.renderOptions()}
      </Dialog>
    );
  }

  private renderOptions() {
    return(
      <div className="options">
        <div className="option-container">
          <div className="option-label">Game size:</div>
          <InputText 
            type="text"
            keyfilter="pint"
            value={this.state.gameOptions.gameSize}
            onChange={(e) => this.setGameSize((e.target as any).value)}
            />
        </div>
        <div className="option-container">
          <div className="option-label">Number of mines:</div>
          <InputText
            type="text"
            keyfilter="pint"
            value={this.state.gameOptions.numMines}
            onChange={(e) => this.setNumMines((e.target as any).value)} />
        </div>
        <div className="option-container">
          <div className="option-label">Cheat Mode:</div>
          <Checkbox
            checked={this.state.gameOptions.isDebugMode}
            onChange={() => this.toggleDebugMode()}/>
        </div>
        <br/>
        <Button onClick={() => this.props.onConfirm(this.state.gameOptions)}
        label={"Save options"}/>
      </div>
    );
  }

  private setGameSize(gameSize: number) {
    this.setState({gameOptions: {...this.state.gameOptions, gameSize}});
  }

  private setNumMines(numMines: number) {
    this.setState({gameOptions: {...this.state.gameOptions, numMines}});
  }

  private toggleDebugMode() {
    this.setState({gameOptions: {...this.state.gameOptions, isDebugMode: !this.state.gameOptions.isDebugMode}});
  }
}

