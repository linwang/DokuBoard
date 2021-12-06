import React from 'react';
import {Square} from './square.js'

export function Board(props)
{ 
  console.log('Render Board');
  const size = props.gridProp.length;

  let renderRow = function (row) {
    let cells = [];    
    for(let column = 0; column < size; column++)
    {
      let index = row * size + column;
      let cell = <Square key = {index.toString()} value = {props.gridProp[row][column]}/>
      cells.push(cell);
    }
    return cells;
  }
  
  let boardRows = [];
  for(let row = 0; row <size; row++ )
  {
    let boardRow = renderRow(row);
    boardRows.push(<div className = "board-row" key = {`row ${row}`}>{boardRow}</div>);
  }
  return (
  <div>
    {boardRows}
  </div>);  
}