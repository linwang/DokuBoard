export class Logging
{
  static log(message)
  {    
        console.log(message);
  }
  static equals(objA, objB, message)
  {   
      console.assert(objA === objB, `${objA} !== ${objB}: ${message}`);
  }
  static error(condition, message)
  {
      console.assert(condition, message);
  }
}
