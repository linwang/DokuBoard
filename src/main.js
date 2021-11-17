const DEBUG = false;
const input = document.querySelector('#input');
const output = document.querySelector('#output');
input.onchange = function ()
{
  const file = input.files[0];
  if(!file)
  {
    Logging.error(true, "No file");
    return;
  }
  let reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    let board = new KendokuBoard(content);
    output.innerHTML = '';
    board.setViewPort(output);
    let solve = document.createElement('button');
    solve.textContent = "Solve puzzle";
    solve.onclick = function ()
    {
      board.solve();
      board.refreshView();
      solve.style.visibility = 'hidden';
    }
    output.appendChild(solve);
  }
  reader.readAsText(file);
}
