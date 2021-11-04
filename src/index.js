import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function DropDown(props)
{
  let getOptions = function(options){
    if(options !== null && options.length > 0){
      return options.map((item) => {
        return (
        <option value={item.id}>{item.name}</option>);
    }, this);
    }
  }
  return (
    <select className = "dropdown">
      {getOptions(props.options)}
    </select>
  )
}
function Rectangle(props)
{
  return (
    <button className = "rectangle"
      >
      {props.value}
    </button>
  )
}

class Game extends React.Component {
  render() {
    let gameOptions = [
      {id:"ken", name:"Kendoku"},
      {id:"su", name:"Sudoku"}
    ];
    let sizeOptions = [
      {id:"three", name:"3"},
      {id:"six", name:"6"},
      {id:"nine", name:"9"},
    ]
    return (
      <div className="game">
        <label>
            Select the type of game:
        </label>
        <div>
          <DropDown options = {gameOptions}/>
        </div>
        <lable>
          Choose the size of board:
        </lable>
        <div>
          <DropDown options = {sizeOptions}/>
        </div>
        <div>
        <Rectangle value = "Create"/>
        </div>        
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
