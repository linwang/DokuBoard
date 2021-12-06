import React from 'react';
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

function NumberBox(props)
{
  return <div>NumberBox: ToDo</div>;
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