//the sum of coordinates equals results
class ArithmeticRule
{
  constructor(result, operator, locations)
  {
    this.result = result;
    this.symbol = operator;
    this.locations = locations;
  }
  //check values and possible values against rule
  //return a list of possible values to remove
  getImpossibleValues(cells)
  {
    let getPossibles;
    switch(this.symbol)
    {
      case '+':
        getPossibles = function(result, term){ return [result - term];};
        break;
      case '-':
        getPossibles = function(result, term){ return [result + term, term - result];};
        break;
      case '*':
        getPossibles = function(result, term){ return [result/term];};
        break;
      case '/':
        getPossibles = function(result, term){ return [result * term, term / result];};
        break;
      default:
        return;
    }

    let isValuePossible = function(iLoc, locs, value, solution)
    {
      if(iLoc === locs.length) return (value === solution);

      let possibleSolutions = getPossibles(solution, value);
      for(let nextSolution of possibleSolutions)
      {
        let nextLoc = locs[iLoc];
        let nextCell = cells[nextLoc[0]][nextLoc[1]];
        for(let nextValue of nextCell.getPossibleValues())
        {
          if(isValuePossible(iLoc + 1, locs, nextValue, nextSolution))
          {
            return true;
          }
        }
      }
      return false;
    }
    let possibleValuesToRemove = {};
    //for each possible value in each cell, check to see if it is possible. If the answer is no
    //add it to the list of values to remove
    for(let timesToRotate = this.locations.length; timesToRotate > 0; timesToRotate--)
    {
      let loc = this.locations[0];
      let cell = cells[loc[0]][loc[1]];
      if(!cell.isValueSet())
      {
        let valuesToRemove = [];
        for(let value of cell.getPossibleValues())
        {
          if(!isValuePossible(1, this.locations, value, this.result))
          {
            valuesToRemove.push(value);
          }
        }
        if(valuesToRemove.length > 0)
        {
          possibleValuesToRemove[JSON.stringify(loc)] = valuesToRemove;
        }
      }
      this.locations.push(this.locations.shift());

    }
    return possibleValuesToRemove;
  }

  isValid(cells)
  {
    //TODO: add validation
    return true;
  }

  toString()
  {
    return `${this.result}=${this.symbol} at locations ${this.locations}`;
  }
}

//cells should have unique values from 1-n (n = coordinates.length)
class UniqueValuesRule
{
  constructor(locs){
    this.locations = locs;
  }
  getImpossibleValues(cells){
    let possiblesToRemove = {};
    for(let oriLoc of this.locations)
    {
      let cell = cells[oriLoc[0]][oriLoc[1]];
      if(cell.isValueSet())
      {
        let value = cell.getValue();
        for(let tarLoc of this.locations)
        {
          if(tarLoc === oriLoc) continue;
          let tarCell = cells[tarLoc[0]][tarLoc[1]];
          if(tarCell.isPossible(value))
          {
            let key = JSON.stringify(tarLoc);
            if(!possiblesToRemove[key]) possiblesToRemove[key] = [];
              possiblesToRemove[key].push(value);
          }
        }
      }
    }
    return possiblesToRemove;
  }

  isValid(cells)
  {
    let uniques = {};
    for(let loc of this.locations)
    {
      let cell = cells[loc[0]][loc[1]];
      if(cell.isValueSet())
      {
        if(uniques[cell.getValue()] != null)
        {
          return false;
        }
        uniques[cell.getValue()] = true;
      }
    }
    return true;
  }

  toString()
  {
    return `Check for unique values for cells at locations ${this.locations}`;
  }
    //todo: make it better
    /*{//find same value sets, (1,5) (1,5) on two cells
      let possiblesOne, possiblesTwo;
      let matchingCoordinates;
      let cellOne, cellTwo;
      for(let iOne = 0; iOne < this.locations.length; iOne++)
      {
        cellOne = cells[this.locations[iOne][0]][this.locations[iOne][1]];
        if(cellOne.isValueSet()) continue;
        matchingCoordinates = [this.locations[iOne]];
        possiblesOne = cellOne.possibleValues;
        for(let iTwo = iOne + 1; iTwo < cells.length; iTwo++)
        {
          cellTwo = cells[this.locations[iTwo][0]][this.locations[iTwo][1]];
          if(cellTwo.isValueSet()) continue;
          possiblesTwo = cellTwo.possibleValues;

          if(JSON.stringify(possiblesOne) === JSON.stringify(possiblesTwo))
          {
            matchingCoordinates.push(this.locations[iTwo]);
            if (possiblesOne.length === matchingCoordinates.length)
            {
              //remove possibles from cells other than matchingCoordinates
              for(let c = 0; c < this.locations.length; c++)
              {
                if(!matchingCoordinates.find(value => this.locations[c] === value))
                {
                  let key = JSON.stringify(this.locations[c]);
                  if(!possiblesToRemove[key]) possiblesToRemove[key] = [];
                   possiblesToRemove[key].push(...possiblesOne);
                }
              }
            }
          }
        }
      }
    }*/
    /*{//find solo possibilities, (1,2,3,4)(2,3,4)(2,3,4)
      let possibles = new Array(this.size).fill(0);
      let cPossibles = new Array(this.size);
      for(let cell of this.locations)
      {
        if(cells[cell[0]][cell[1]].isValueSet()) possibles[cells[cell[0]][cell[1]].value - 1] = Infinity;
        else
        {
          for(let possible of cells[cell[0]][cell[1]].possibleValues)
          {
            possibles[possible-1]++;
            cPossibles[possible-1] = [cell[0],cell[1]];
          }
        }
      }
      let index = possibles.findIndex(x => x === 1);
      if(index > - 1)
      {
        let value = index + 1;
        let possibles = cells[this.locations[index][0]][this.locations[index][1]].possibleValues;
        let key = JSON.stringify(this.locations[index]);
        possiblesToRemove[key] = possibles.filter(v => v !== value);
      }
    }*/
}
