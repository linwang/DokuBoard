
class WorkQueue
{
  constructor(source)
  {
    this.workItems = [];
  }

  add(... args)
  {
    let func = args.shift();
    let work = new WorkItem(func, args);
    this.workItems.push(work);
  }
  runNext()
  {
    if(this.getCount() === 0) return false;

    let work = this.workItems.shift();
    Logging.log(`Run work item ${work}`);
    work.func.call(... work.arguments);
    return true;
  }
  getCount()
  {
    return this.workItems.length;
  }
  toString()
  {
    return this.workItems.toString();
  }
}
class WorkItem
{
  constructor(func, args)
  {
    this.func = func;
    this.arguments = args;
  }
  toString()
  {
    return `${this.func.name}(${this.arguments})`;
  }
}
