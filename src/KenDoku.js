import { Logging } from './logging.js'
import { ArithmeticRule, UniqueValuesRule } from './rule.js';
import { CellInfo } from './cell.js';

//Kendoku rules:
// *unique numbers 1-n in each row and column
// *four function Rules cover groups of cells i.e. cells[0][0] + cells[1][0] = 5
//to solve a kendoku puzzle, can check the cells possible values against Kendoku rules.
//When a cell's possible values reduce to a single value, then its value is that one
export class KendokuBoard
{
  //ToDo: change file format to JSON
  constructor(content)
  {
    let arrOfData = content.split(';');

    //initialize size
    let size = parseInt(arrOfData[0]);
    Logging.error((size >= 3)||(size <= 9), `${size} is invalid.`);

    this.size = size;

    //initialize cells
    this._cells = new Array(this.size);
    let possibleValues;
    for(let r = 0; r < this.size; r++)
    {
      this._cells[r] = new Array(this.size);
      for(let c  = 0; c < this.size; c++)
      {
        possibleValues = new Array(this.size);
        for(let i = 0; i < possibleValues.length; i++)
        {
          possibleValues[i] = i + 1;
        }
        this._cells[r][c] = new CellInfo(possibleValues);
      }
    }

    //initialize Rules from raw data
    let parseRule = function(cells, rawData)
    {
        let rawRule = rawData.split(',');
        if(!rawRule || rawRule.length < 2) return null;

        let result = parseInt(rawRule[0]);
        let symbol = rawRule[1];
        let locations = [];
        for(let i = 2; i < rawRule.length; i+=2)
        {
          let r = parseInt(rawRule[i]);
          let c =  parseInt(rawRule[i+1]);
          locations.push([r,c]);
        }
        return new ArithmeticRule(result, symbol, locations);
    }

    this._rules = new Array(0);
    for(let i = 1; i < arrOfData.length; i++)
    {
      let rule = parseRule(this._cells, arrOfData[i]);
      if(!rule) continue;

      //a rule that only needs to set value should not be stored but processed immediately
      if(rule.symbol === ' ')
      {
        let loc = rule.locations[0];
          this._cells[loc[0]][loc[1]].setValue(rule.result);
      }
      else
      {
          this._rules.push(rule);
      }
    }

    //add unique value rules for row and columns
    for(let r = 0; r < this.size; r++)
    {
      let locs = [];
      for(let c = 0; c < this.size; c++)
      {
        locs.push([r,c]);
      }
      let rule = new UniqueValuesRule(locs);
      this._rules.push(rule);
    }

    for(let c = 0; c < this.size; c++)
    {
      let locs = [];
      for(let r = 0; r < this.size; r++)
      {
        locs.push([r,c]);
      }
      let rule = new UniqueValuesRule(locs);
      this._rules.push(rule);
    }

    this.bSolved = false;
  }
  //ToDo: move to its own component
  //KendokuBoard is added under the last element in parent
  setViewPort(parent)
  {
    //create the kendoku table element under parent
    //connect cells to their corresponding elements
    let tableElement = document.createElement('table');
    parent.appendChild(tableElement);
    for(let r = 0; r < this.size; r++)
    {
      let tableRow = document.createElement('tr');
      for(let c = 0; c < this.size; c++)
      {
        let cellElement = document.createElement('td');
        cellElement.setAttribute('class', 'cell');
        let RuleElement = document.createElement('div');
        RuleElement.setAttribute('class', 'rule');
        let cell = this._cells[r][c];
        let borderStyle = '1px solid black';
        let cViewableRules = 0;

        //ToDo: add formula viewing support.
        /*if(cell.rules !== null)
        {
          for(let rule of cell.rules)
          {
            if((!rule.locations) || (rule.locations.length === 0)) continue;

            cViewableRules++;
            //figure out rule's topLeft corner
            let topLeft = getTopLeftCoordinate(rule.locations);

            if((topLeft.x === x) && (topLeft.y === y))
              RuleElement.textContent = `${rule.result}${rule.symbol}`;

            //figure out cell's four borders
            //if no cell above me, draw top border
            if(!rule.locations.find(loc => ((loc.x === x) && (loc.y === y - 1))))
              cellElement.style.borderTop = borderStyle;

            //if no cell below me, draw bottom border
            if(!rule.locations.find(loc => ((loc.x === x) && (loc.y === y + 1))))
              cellElement.style.borderBottom = borderStyle;

            //if no cell t othe left of me, draw left border
            if(!rule.locations.find(loc => ((loc.x === x - 1) && (loc.y === y))))
              cellElement.style.borderLeft = borderStyle;

            //if no cell to the right of me, draw right border
            if(!rule.locations.find(loc => ((loc.x === x + 1) && (loc.y === y))))
              cellElement.style.borderRight = borderStyle;
          }
        }*/

        if(cViewableRules === 0)
          cellElement.style.border = borderStyle;

        cellElement.appendChild(RuleElement);
        cell.valueElement = document.createElement('span');
        cell.valueElement.setAttribute('class', 'cell');
        cell.valueElement.textContent = cell.toString();
        cellElement.appendChild(cell.valueElement);
        tableRow.appendChild(cellElement);
      }
      tableElement.appendChild(tableRow);
    }
  }

  //ToDo: move to its own component
  //update cells' values
  refreshView()
  {
    for(let r = 0; r < this.size; r++)
      for(let c = 0; c < this.size; c++)
      {
        let cell = this._cells[r][c];
        cell.valueElement.textContent = cell.toString();
      }
  }

  isValid()
  {
    for(let rule of this._rules)
    {
      if(!rule.isValid(this._cells))
      {
        return false;
      }
    }
    return true;
  }

  isSolved()
  {
    if(this.bSolved) {
      return this.bSolved;
    }
    for(let row of this._cells)
    {
      for(let cell of row)
      {
        if(!cell.isValueSet()) {
          return false;
        }
      }
    }
    this.bSolved = true;
    return this.bSolved;
  }

  //solve cells according to Rules and by guessing
  solve()
  {
    if(this.isSolved()) {
      return;
    }
    //TODO: use work queue to only run rules with corresponding values change
    let hasValuesToRemove;
    do
    {
      hasValuesToRemove = false;
      for(let rule of this._rules)
      {
        let possibleValuesToRemove = rule.getImpossibleValues(this._cells);
        Logging.log(`Running rule ${rule}`);
        for(let key in possibleValuesToRemove)
        {
          let loc = JSON.parse(key);
          let cell = this._cells[loc[0]][loc[1]];
          let values = possibleValuesToRemove[key];
          for(let value of values)
          {
              Logging.error(!(cell.isValueSet() && cell.getValue(value) > -1),
              `Attempting to delete value of a set cell [${loc[0]},${loc[1]}] = ${value} with rule ${rule}`);

              if(cell.removePossibleValue(value)) {
                  hasValuesToRemove = true;
                }
          }
        }
          Logging.error(rule.isValid(this._cells), `Board is in an invalid state after processing rule ${rule}`);
      }
    }while(hasValuesToRemove);

    if(!this.isSolved())
    {
      //ToDo, add guessing and backtracking logic
      //save the board's cells
      //make a guess
      //run the rules until no-changes are made (executeRules)
      //check to see if the board is still valid && solved
      //if valid && solved return
      //if valid && not solved, make a next guess
      //if invalid, add move to invalidMoves and undo the move
      //I need to extract these out since the doer of these are not board but a player,
      //a computer player.
      //a board can make a move, execute rules,
      //check to see if it is valid or solved.
      //A player can make a move
      //An AI player can generate a move, after the board carries out the move, it needs to
      //evaluate the validity of the move. Undo if invalid and add that move to invalid moves.
      //A history class can store a stack of moves (snapshot of board before move and value/possible value changes)
      //the history class can undo and redo.

    }
  }
  getGrid() {
    if(this._cells == null) {
      return null;
    }
    let grid = new Array(this._cells.length);
    for(let r = 0; r < grid.length; r++) {
      grid[r] = new Array(this._cells[r].length);
      for(let c = 0; c < grid[r].length; c++) {
        grid[r][c] = this._cells[r][c].getValue();
      }
    }
    return grid;
  }

  getSize() {
    if( this._cells == null) {
      return 0;
    }
    return this._cells.length;
  }

  getRules() {
    let rules = JSON.parse(JSON.stringify(this._rules));
    return rules;
  }
}
