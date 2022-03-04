const mathsCharacter = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  '.',
  'x',
  '÷',
  '+',
  '-',
  '=',
  '%',
  'π',
  '(',
  ')',
];
const engCharacter = [
  ' ',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

export default function checkEquation(line: any) {
  let middleEqual: number = 0;

  if (typeof line === 'string') {
    let stringArray = line.split('');
    let counter = 0;
    for (let cha of stringArray) {
      if (!engCharacter.includes(cha) && !mathsCharacter.includes(cha)) {
        return false;
      }
      if (counter === 0) {
        if (cha === '=') {
          return false;
        }
      }
      if (cha === '=') {
        middleEqual++;
      }
      counter++;
    }
  } else if (typeof line === 'object') {
    Object.values(line).forEach((part, index) => {
      //object will be fraction so can be ignored
      if (typeof part === 'string') {
        let stringArray = part.split('');
        let counter = 0;
        for (let cha of stringArray) {
          if (!engCharacter.includes(cha) && !mathsCharacter.includes(cha)) {
            return false;
          }
          if (index === 0 && counter === 0) {
            if (cha === '=') {
              return false;
            }
          }
          if (cha === '=') {
            middleEqual++;
          }
          counter++;
        }
      }
    });
  }

  if (middleEqual === 1) {
    return true;
  }
  return false;
}

export function splitEquation(line: any) {
  if (typeof line === 'string') {
    let equation = line.split('=');
    equation.splice(1, 0, '=');
    return equation;
  } else {
    let object_1: any = {};
    let object_2: any = {};
    let part: number = 1;
    let counter: number = 1;
    for (let key in line) {
      if (typeof line[key] === 'object') {
        if (part === 1) {
          object_1[String(counter)] = line[key];
        } else if (part === 2) {
          object_2[String(counter)] = line[key];
        }
        counter++;
      } else if (typeof line[key] === 'string') {
        if (line[key].includes('=')) {
          let equation = line[key].split('=');
          object_1[String(counter)] = equation[0];
          part = 2;
          counter = 1;
          object_2[String(counter)] = equation[1];
          counter++;
        } else {
          if (part === 1) {
            object_1[String(counter)] = line[key];
          } else if (part === 2) {
            object_2[String(counter)] = line[key];
          }
          counter++;
        }
      }
    }

    return [object_1, {'1': '='}, object_2];
  }
}
