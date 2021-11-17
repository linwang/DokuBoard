import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function DropDown(props)
{
  let getOptions = function(options){
    if(options != null && options.length > 0){
      return options.map((item) => {
        return (
        <option value={item.id} key = {item.id}>{item.name}</option>);
    }, this);
    }
  }
  return (
    <select className = "dropdown">
      {getOptions(props.options)}
    </select>
  )
}

function Choice(props)
{
  return <button className = "button-choice">{props.label}</button>;
}

function NumberBox(props)
{
  return <div>NumberBox: ToDo</div>;
}

function Square(props)
{
  return(<button className = "square">
        {props.value}
        </button>);
}
class Board extends React.Component
{
  constructor(props)
  {
    super(props);
    const countOfCells = props.size * props.size;
    this.state = {cells: new Array(countOfCells).fill(null),
                  size: 3};
  }

  renderRow(row)
  {
    let cells = [];
    for(let column = 0; column < this.state.size; column++)
    {
      let index = row * this.state.size + column;
      let cell = <Square key = {index.toString()} value = {this.state.cells[index]}/>
      cells.push(cell);
    }
    return cells;
  }

  render() {
    let boardRows = [];
    for(let row = 0; row <this.state.size; row++ )
    {
      let boardRow = this.renderRow(row);
      boardRows.push(<div className = "board-row" key = {`row ${row}`}>{boardRow}</div>);
    }
    return (
    <div>
      {boardRows}
    </div>)
  }
}

function ArithmeticEditor(props)
{
  return(
    <div>
    <div>
      1. Select cells for formula
    </div>
    <div>
      2. Select your arithmetic operator
      <Choice label = "+" />
      <Choice label = "-" />
      <Choice label = "*" />
      <Choice label = "/" />
    </div>
    <div>
      3. Add your solution
      <NumberBox />
    </div>
    <div>
      4. Save your choice
      <Choice label = "Set" />
    </div>
    </div>
  )
}
function ValueEditor(props)
{
  return <div>ValueEditor: ToDo</div>;
}
class HomePage extends React.Component
{
  render()
  {
    return (<div>
    <Choice label = "Create a new game"/>
    <Choice label = "Load an existing game"/>
    </div>);
  }
}
class Creator extends React.Component
{

  render(){
    let gameOptions = [
      {id:"ken", name:"Kendoku"},
      {id:"su", name:"Sudoku"}
    ];
    let sizeOptions = [
      {id:"three", name:"3"},
      {id:"six", name:"6"},
      {id:"nine", name:"9"},
    ]
    return (<div>
      <div>Choose type of game:</div>
      <DropDown options = {gameOptions} />
      <div>Choose board size:</div>
      <DropDown options = {sizeOptions} />
    </div>)
  }
}
class Editor extends React.Component
{
  render(){
    return (
    <div>
      Edit board
      <Board size = {3}/>
      <ArithmeticEditor />
      <ValueEditor />
    </div>);
  }
}
class Solver extends React.Component
{
  render()
  {
    return (<div>
      Solve board
      <Board size = {3} />
      <Choice label = "Solve"/>
    </div>);
  }
}
class Game extends React.Component
{
  constructor()
  {
    super();
    this.state = {current: "Homepage"};
  }
  render() {

    return (
      <div className="game">
        Welcome to your board game
        <HomePage />
        <Creator />
        <Editor />
        <Solver />
      </div>
    );

  }
}

// ========================================

ReactDOM.render
(
  <Game />,
  document.getElementById('root')
);
