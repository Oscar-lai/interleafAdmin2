export function checkAns(ans: any, modelAns: any) {
  if (typeof modelAns === 'string' && typeof ans === 'string') {
    return ans === modelAns;
  } else if (typeof modelAns === 'object' && typeof ans === 'object') {
    return objectEqual(ans, modelAns);
  } else {
    return false;
  }
}

//typeof answer is 'object' (can be array or object) -> for return wehther two object is the same or not
function objectEqual(ans: any, modelAns: any) {
  //array is not about the ordering
  if (Array.isArray(modelAns) && Array.isArray(ans)) {
    return arraySimilar(ans, modelAns);
  }
  //if obj has array -> array must obey ordering
  else if (!Array.isArray(modelAns) && !Array.isArray(ans)) {
    for (let key in modelAns) {
      if (!(key in ans)) {
        return false;
      }

      if (Array.isArray(ans[key]) && Array.isArray(modelAns[key])) {
        //array case
        if (!arrayEqual(ans[key], modelAns[key])) {
          return false;
        }
      } else if (
        typeof ans[key] === 'string' &&
        typeof modelAns[key] === 'string'
      ) {
        if (ans[key] !== modelAns[key]) {
          return false;
        }
      } else if (
        typeof ans[key] === 'object' &&
        typeof modelAns[key] === 'object'
      ) {
        //object -> array / string
        for (let keykey in modelAns[key]) {
          if (!(keykey in ans[key])) {
            return false;
          }

          if (
            Array.isArray(ans[key][keykey]) &&
            Array.isArray(modelAns[key][keykey])
          ) {
            //array case
            if (!arrayEqual(ans[key][keykey], modelAns[key][keykey])) {
              return false;
            }
          } else if (
            typeof ans[key][keykey] === 'object' &&
            typeof modelAns[key][keykey] === 'object'
          ) {
            if (!objectEqual(ans[key][keykey], modelAns[key][keykey])) {
              return false;
            }
          } else if (
            typeof ans[key][keykey] === 'string' &&
            typeof modelAns[key][keykey] === 'string'
          ) {
            if (ans[key][keykey] !== modelAns[key][keykey]) {
              return false;
            }
          } else {
            return false;
          }
        }

        for (let keykey in ans[key]) {
          //if extra key in ans is also wrong
          if (!(keykey in modelAns[key])) {
            return false;
          }
        }
      } else {
        return false;
      }
    }

    for (let key in ans) {
      //if extra key in ans is also wrong
      if (!(key in modelAns)) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}
//convert array into string and check whether identical
function arrayEqual(array1: any[], array2: any[]) {
  // console.log(array2);
  let index = 0;
  for (let element of array2) {
    if (typeof element === 'string') {
      if (array1[index] !== element) {
        return false;
      }
    } else if (typeof element === 'object') {
      if (typeof array1[index] !== 'object') {
        return false;
      }
      for (let key in element) {
        if (!(key in array1[index])) {
          return false;
        }
        if (element[key] !== array1[index][key]) {
          return false;
        }
      }
    }
    index++;
  }
  return true;
}

//array not ordering checking
function arraySimilar(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) {
    return false;
  }
  for (let answer of a2) {
    if (typeof answer === 'string') {
      if (!a1.includes(answer)) {
        return false;
      }
    }
    if (typeof answer === 'object') {
      const extractedAns = checkObjInArray(answer, a1);
      if (extractedAns.length !== 1) {
        return false;
      }
    }
  }
  return true;
}
//used by objectEqual()
//check if another array includes a specific object with the same key and value
//return the array containing the matched object in the input array
function checkObjInArray(obj: any, array: any[]) {
  const output = array.filter(value => {
    let include = true;
    for (let key in obj) {
      if (typeof value !== 'object') {
        include = false;
      }
      //element in array is not object
      else if (!(key in value)) {
        include = false;
      } //no such key in that element in array
      if (typeof obj[key] === 'string' && typeof value[key] === 'string') {
        if (value[key] !== obj[key]) {
          include = false;
        }
      } else if (Array.isArray(obj[key]) && Array.isArray(value[key])) {
        if (!arrayEqual(obj[key], value[key])) {
          include = false;
        }
      } else {
        include = false;
      } //have key but the value is not the same type
    }
    return include;
  });

  return output;
}
