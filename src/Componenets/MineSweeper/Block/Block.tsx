import * as React from 'react';
import './Block.css';

export interface IBlockProps {
  readonly isPressed: boolean;
  readonly value: number;
  onClick: undefined | (() => void);
}

interface IBlockState {
  hasFlag: boolean;
}

export class Block extends React.Component<IBlockProps, IBlockState> {
  public constructor(props: IBlockProps) {
    super(props);
    this.state = {
      hasFlag: false,
    };
    this.onLeftClick = this.onLeftClick.bind(this);
  }

  public render() {
    const onClick = !this.state.hasFlag && !this.props.isPressed ? this.props.onClick : undefined;
    const classes = `block
      ${this.props.isPressed ? "is-pressed" : ""}
      ${onClick ? "clickable" : ""}`;
    const onLeftClick = !this.props.isPressed ? this.onLeftClick : undefined;

    return (
      <div className={classes} onClick={onClick} onContextMenu={onLeftClick}>
        <div className="number-container">
          {this.getInnerValue()}
        </div>
      </div>
    );
  }

  private getInnerValue() {
    const value = this.props.value;

    return !this.props.isPressed
      ? this.state.hasFlag
        ? "X"
        : ""
      : value > 0
        ? value
        : value < 0 
          ? this.renderMine()
          : undefined;
  }

  private renderMine() {
    return -1;
  }

  private onLeftClick(e: any) {
    e.preventDefault();
    if(!this.props.isPressed) {
      this.setState({
        hasFlag: !this.state.hasFlag
      })
    }
  }
}
