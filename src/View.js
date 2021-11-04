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

function getTopLeftCoordinate(coordinates)
{
  if((!coordinates)||(coordinates.length === 0)) return null;
  let topLeft = coordinates[0];
  for(let i = 1; i < coordinates.length; i++)
  {
    if(coordinates[i][1] < topLeft[1])
    {
      topLeft = coordinates[i];
    }
    else if(coordinates[i][1] === topLeft[1])
    {
      if(coordinates[i][0] < topLeft[0])
        topLeft = coordinates[i];
    }
  }
  return topLeft;
}
