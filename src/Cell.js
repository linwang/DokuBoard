/*class Cell
{
  constructor(possibleValues = null, rules = null)
  {
    this.cellValue = new CellValue(possibleValues);
    this.rules = rules;
  }
}*/
export class CellInfo
{
  _possibleValues;
  constructor(possibleValues = null)
  {
    this._possibleValues = possibleValues;
  }
  toString()
  {
    //if(DEBUG) return `${this.getValue()}{${this._possibleValues}}`;
    if(this.isValueSet()) return `${this.getValue()}`;
    return '';
  }
  isValueSet()
  {
    return (this._possibleValues.length === 1);
  }
  getValue()
  {
    if(this._possibleValues.length !== 1)
        return null;

    return this._possibleValues[0];
  }
  setValue(value)
  {
    if(!isNaN(value))
      this._possibleValues = [value];
  }
  removePossibleValue(value)
  {
      let i = this._possibleValues.indexOf(value);
      if(i < 0) return false;
      this._possibleValues.splice(i, 1);
      return true;
  }
  isPossible(value)
  {
    let i = this._possibleValues.indexOf(value);
    return (i > -1);
  }
  getPossibleValues()
  {
    return this._possibleValues.slice();
  }
}
