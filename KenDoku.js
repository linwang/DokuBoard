//Kendoku rules:
// *unique numbers 1-n in each row and column
// *four function Rules cover groups of cells i.e. cells[0][0] + cells[1][0] = 5
//to solve a kendoku puzzle, can check the cells possible values against Kendoku rules.
//When a cell's possible values reduce to a single value, then its value is that one
class KendokuBoard
{
  #cells = [];
  #rules = [];
  constructor(content)
  {
    let arrOfData = content.split(';');

    //initialize size
    let size = parseInt(arrOfData[0]);
    if((size < 3)||(size > 9)) console.log(`${size} is invalid.`);
    this.size = size;

    //initialize cells
    this.#cells = new Array(this.size);
    let possibleValues, rule;
    for(let r = 0; r < this.size; r++)
    {
      this.#cells[r] = new Array(this.size);
      for(let c  = 0; c < this.size; c++)
      {
        possibleValues = new Array(this.size);
        for(let i = 0; i < possibleValues.length; i++)
        {
          possibleValues[i] = i + 1;
        }
        this.#cells[r][c] = new CellInfo(possibleValues);
      }
    }

    //initialize Rules from raw data
    let parseRule = function(cells, rawData)
    {
        let rawRule = rawData.split(',');
        if(!rawRule || rawRule.length < 2) return null;

        let result = parseInt(rawRule[0]);
        let symbol = rawRule[1];
        let coordinates = {};
        let key;
        for(let i = 2; i < rawRule.length; i+=2)
        {
          let r = parseInt(rawRule[i]);
          let c =  parseInt(rawRule[i+1]);
          key = JSON.stringify([r,c]);
          coordinates[key] = cells[r][c];
        }
        return new ArithmeticRule({result: result, symbol: symbol, coordinates: coordinates});
    }

    this.#rules = new Array(0);
    for(let i = 1; i < arrOfData.length; i++)
    {
      let rule = parseRule(this.#cells, arrOfData[i]);
      if(!rule) continue;

      //a rule that only needs to set value should not be stored but processed immediately
      if(rule.symbol === ' ')
      {
          let keys = Object.keys(rule.cellHash);
          let loc = JSON.parse(keys[0]);
          this.#cells[loc[0]][loc[1]].setValue(rule.result);
      }
      else
      {
          this.#rules.push(rule);
      }
    }

    //add unique value rules for row and columns
    for(let r = 0; r < this.size; r++)
    {
      let cList = {};
      for(let c = 0; c < this.size; c++)
      {
        let key = JSON.stringify([r,c]);
        cList[key] = this.#cells[r][c];
      }
      let rule = new UniqueValuesRule({coordinates:cList});
      this.#rules.push(rule);
    }

    for(let c = 0; c < this.size; c++)
    {
      let cList = {};
      for(let r = 0; r < this.size; r++)
      {
        let key = JSON.stringify([r,c]);
        cList[key] = this.#cells[r][c];
      }
      let rule = new UniqueValuesRule({coordinates:cList});
      this.#rules.push(rule);
    }
  }

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
        let cell = this.#cells[r][c];
        let borderStyle = '1px solid black';
        let cViewableRules = 0;

        //ToDo: add formula viewing support.
        /*if(cell.rules !== null)
        {
          for(let rule of cell.rules)
          {
            if((!rule.coordinates) || (rule.coordinates.length === 0)) continue;

            cViewableRules++;
            //figure out rule's topLeft corner
            let topLeft = getTopLeftCoordinate(rule.coordinates);

            if((topLeft.x === x) && (topLeft.y === y))
              RuleElement.textContent = `${rule.result}${rule.symbol}`;

            //figure out cell's four borders
            //if no cell above me, draw top border
            if(!rule.coordinates.find(coordinate => ((coordinate.x === x) && (coordinate.y === y - 1))))
              cellElement.style.borderTop = borderStyle;

            //if no cell below me, draw bottom border
            if(!rule.coordinates.find(coordinate => ((coordinate.x === x) && (coordinate.y === y + 1))))
              cellElement.style.borderBottom = borderStyle;

            //if no cell t othe left of me, draw left border
            if(!rule.coordinates.find(coordinate => ((coordinate.x === x - 1) && (coordinate.y === y))))
              cellElement.style.borderLeft = borderStyle;

            //if no cell to the right of me, draw right border
            if(!rule.coordinates.find(coordinate => ((coordinate.x === x + 1) && (coordinate.y === y))))
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

  //update cells' values
  refreshView()
  {
    for(let r = 0; r < this.size; r++)
      for(let c = 0; c < this.size; c++)
      {
        let cell = this.#cells[r][c];
        cell.valueElement.textContent = cell.toString();
      }
  }

  //solve cells according to Rules
  solve()
  {
    let hasValuesToRemove;
    do
    {
      hasValuesToRemove = false;
      for(let i = 0; i < this.#rules.length; i++)
      {
        let possibleValuesToRemove = this.#rules[i].getImpossibleValues(this.#cells);
        for(let key in possibleValuesToRemove)
        {
          let loc = JSON.parse(key);
          if(key.length > 0)
          {
            if(this.cells[loc[0]][loc[1]].removePossibleValues(possibleValuesToRemove[key]))
            {
                hasValuesToRemove = true;
            }
          }
        }
      }
    }while(hasValuesToRemove);
  }
}

class CellInfo
{
  constructor(possibleValues = null)
  {
    this.possibleValues = possibleValues;
    this.valueElement = null;
  }
  toString()
  {
    if(DEBUG) return `${this.getValue()}{${this.possibleValues}}`;
    if(this.isValueSet()) return `${this.getValue()}`;
    return '';
  }
  isValueSet()
  {
    return (this.possibleValues.length === 1);
  }
  getValue()
  {
    if(this.possibleValues.length !== 1)
        return null;

    return this.possibleValues[0];
  }
  setValue(value)
  {
    if(!isNaN(value))
      this.possibleValues = [value];
  }
  findIndex(value)
  {
    return this.possibleValues.indexOf(value);
  }
  removePossibleValues(values)
  {
    console.log(`removePossibleValues(${values})`);
    if(values === null) return false;

    let output = false;
    //make a copy of values since values may point to cell.possibleValues,
    //which mess up the deletion loop
    let vToRemove = JSON.parse(JSON.stringify(values));
    for(let value of vToRemove)
    {
      let index = this.possibleValues.findIndex(v => v === value);
      if(index > -1)
      {
        this.possibleValues.splice(index, 1);
        output = true;
      }
    }
    return output;
  }
}
