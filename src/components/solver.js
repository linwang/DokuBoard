import React from 'react';
import {Choice} from './choice.js'
import {Board} from './board.js'

export function Solver(props){
    console.log('render Solver');
      return (
      <div>
        Solve board
        <Board gridProp = {props.gridProp}/>
        <Choice labelProp = "Solve" handleClick = {props.handleSolve}/>
      </div>
      ); 
  }