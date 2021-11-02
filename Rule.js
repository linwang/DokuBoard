//the sum of coordinates equals results
class ArithmeticRule
{
  constructor(raw)
  {
    this.cellHash = raw.coordinates;
    this.result = raw.result;
    this.symbol = raw.symbol;
  }
  //check values and possible values against rule, return a list of possible values to remove
  getImpossibleValues()
  {
    let getPossibles;
    let possibleValuesToRemove = [];
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

    let validatePossibleValues = function(hash, keys, curIndex, result, getPossibles, possibleValuesToRemove)
    {
      let loc = JSON.parse(keys[curIndex]);
      let cell = hash[keys[curIndex]];

      if(curIndex === keys.length - 1)
          return cell.possibleValues.find(value => value === result);

      let found, possibles, valuesToRemove = new Array(0);
      for(let value of cell.possibleValues)
      {
        found = false;
        possibles = getPossibles(result, value);
        for(let possible of possibles)
        {
          if(validatePossibleValues(hash, keys, curIndex + 1, possible, getPossibles, possibleValuesToRemove))
          {
            if(curIndex !== 0) return true;
              found = true;
              break;
          }
        }
        if(!found)
          valuesToRemove.push(value);
      }

      if(curIndex !== 0) return false;

      if(valuesToRemove.length > 0)
      {
        let key = keys[curIndex];
        if(!possibleValuesToRemove[key]) possibleValuesToRemove[key] = [];
        possibleValuesToRemove[key].push(...valuesToRemove);
      }
    }
    let keys = Object.keys(this.cellHash);
    for(let timesToRotate = keys.length; timesToRotate > 0; timesToRotate--)
    {
      if(!this.cellHash[keys[0]].isValueSet())
        validatePossibleValues(this.cellHash, keys, 0, this.result, getPossibles, possibleValuesToRemove);
      keys.push(keys.splice(0,1)[0]);
    }
    return possibleValuesToRemove;
  }
}

//cells should have unique values from 1-n (n = coordinates.length)
class UniqueValuesRule
{
  constructor(raw){
    this.cellHash = raw.coordinates;
  }

  getImpossibleValues(){
    let possiblesToRemove = {};
    for(let keySource in this.cellHash)
    {
      if(this.cellHash[keySource].isValueSet())
      {
        let value = this.cellHash[keySource].getValue();
        for(let keyTarget in this.cellHash)
        {
          if(keySource === keyTarget) continue;
          if(this.cellHash[keyTarget].findIndex(value) > -1)
          {
            if(!possiblesToRemove[keyTarget]) possiblesToRemove[keyTarget] = [];
              possiblesToRemove[keyTarget].push(value);
          }
        }
      }
    }
    return possiblesToRemove;
  }
    //todo: make it better
    /*{//find same value sets, (1,5) (1,5) on two cells
      let possiblesOne, possiblesTwo;
      let matchingCoordinates;
      let cellOne, cellTwo;
      for(let iOne = 0; iOne < this.cellHash.length; iOne++)
      {
        cellOne = cells[this.cellHash[iOne][0]][this.cellHash[iOne][1]];
        if(cellOne.isValueSet()) continue;
        matchingCoordinates = [this.cellHash[iOne]];
        possiblesOne = cellOne.possibleValues;
        for(let iTwo = iOne + 1; iTwo < cells.length; iTwo++)
        {
          cellTwo = cells[this.cellHash[iTwo][0]][this.cellHash[iTwo][1]];
          if(cellTwo.isValueSet()) continue;
          possiblesTwo = cellTwo.possibleValues;

          if(JSON.stringify(possiblesOne) === JSON.stringify(possiblesTwo))
          {
            matchingCoordinates.push(this.cellHash[iTwo]);
            if (possiblesOne.length === matchingCoordinates.length)
            {
              //remove possibles from cells other than matchingCoordinates
              for(let c = 0; c < this.cellHash.length; c++)
              {
                if(!matchingCoordinates.find(value => this.cellHash[c] === value))
                {
                  let key = JSON.stringify(this.cellHash[c]);
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
      for(let cell of this.cellHash)
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
        let possibles = cells[this.cellHash[index][0]][this.cellHash[index][1]].possibleValues;
        let key = JSON.stringify(this.cellHash[index]);
        possiblesToRemove[key] = possibles.filter(v => v !== value);
      }
    }*/
}
