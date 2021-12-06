import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { store } from './store/store.js'
import {loadFile, solve} from './actions/actions.js'


import {Solver} from './components/solver.js'
import {FileLoader} from './components/fileloader.js'

function Game() {
  console.log('render Game');
  const [grid, setGrid] = useState(() => {return []});
  const [rules, setRules] = useState(() => {return []});

  const clickLoad = (e) => {
    store.dispatch(loadFile(e));
  }

  const clickSolve = (e) => {
    store.dispatch(solve(e));
  } 

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      console.log(`subscribe triggered`);
      const board = store.getState().boardStates.board;
      if(board == null) return;
      
      setGrid(() => {
        return store.getState().boardStates.grid;
      });
      setRules(() => {        
        return board.getRules();
      });
    });
    return unsubscribe;
  }, []);

  const solver = (store.getState().boardStates.board == null) ? null : <Solver handleSolve = {clickSolve} gridProp = {grid}/>;
  
  return (    
    <div className="game">      
      Welcome to your board game
      <FileLoader handleLoad = {clickLoad}/>
      {solver}
    </div>
  );
}

// ========================================

ReactDOM.render
(
  <Game />,
  document.getElementById('root')
);
