import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props){
  return (
    <button
    className="square"
    onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        key={`Square ${i}`}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderCol(i){
    let row = [];
    for(let cols = i; cols < i + 3; cols++){
      row.push(this.renderSquare(cols));
    }
    return row;
  }

  renderRow(i){
    return (
      <div className='board-row'>
        {this.renderCol(i)}
      </div>
    );
  }

  renderBoard(){
    let rowIndex = 0;
    let board = [];
    for(let rows = 0; rows < 3; rows++){
      board.push(this.renderRow(rowIndex));
      rowIndex += 3;
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      coords: [
        '1, 1', '2, 1', '3, 1',
        '1, 2', '2, 2', '3, 2',
        '1, 3', '2, 3', '3, 3',
      ],
      moveCoords: [''],
      xIsNext: true,
      stepNumber: 0,
      selectedStep: null,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedStep: step,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const moveCoords = this.state.moveCoords.slice(0, this.state.stepNumber + 1);
    const coords = this.state.coords;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      moveCoords: moveCoords.concat(coords[i]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moveCoords = this.state.moveCoords;
    let reverse = false;

    const moves = history.map((step, move) => {
      const desc = move ?
      `Go to Move #${move}: (${moveCoords[move]})` :
      `Go to Game Start`;
      let selected = (this.state.stepNumber === this.state.selectedStep && move === this.state.selectedStep);
      return(
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={selected ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
