class Cell
{
  constructor(possibleValues = null, rules = null)
  {
    this.cellValue = new CellValue(possibleValues);
    this.rules = rules;
  }
}
class CellInfo
{
  #possibleValues;
  constructor(possibleValues = null)
  {
    this.#possibleValues = possibleValues;
  }
  toString()
  {
    if(DEBUG) return `${this.getValue()}{${this.#possibleValues}}`;
    if(this.isValueSet()) return `${this.getValue()}`;
    return '';
  }
  isValueSet()
  {
    return (this.#possibleValues.length === 1);
  }
  getValue()
  {
    if(this.#possibleValues.length !== 1)
        return null;

    return this.#possibleValues[0];
  }
  setValue(value)
  {
    if(!isNaN(value))
      this.#possibleValues = [value];
  }
  removePossibleValue(value)
  {
      let i = this.#possibleValues.indexOf(value);
      if(i < 0) return false;
      this.#possibleValues.splice(i, 1);
      return true;
  }
  isPossible(value)
  {
    let i = this.#possibleValues.indexOf(value);
    return (i > -1);
  }
  getPossibleValues()
  {
    return this.#possibleValues.slice();
  }
}
