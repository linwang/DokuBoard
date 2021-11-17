class Logging
{
  static log(message)
  {
    if(DEBUG)
    {
        console.log(message);
    }
  }
  static equals(objA, objB, message)
  {
    if(DEBUG)
    {
      console.assert(objA === objB, `${objA} !== ${objB}: ${message}`);
    }
  }
  static error(condition, message)
  {
    if(DEBUG)
    {
      console.assert(condition, message);
    }
  }
}
