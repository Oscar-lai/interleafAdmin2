import {normalQ} from '../hooks/useHWQ';

export default function addQuestionType(wholeQuestion: normalQ) {
  let output = [];

  let objectManipulation = wholeQuestion.objectManipulation;
  if (objectManipulation) {
    output.push('objectManipulation');
  }

  let sandwiches = wholeQuestion.sandwiches;
  for (let sandwich of sandwiches) {
    let bigType = sandwich.type;
    if (bigType === 'fiB') {
      if (!output.includes('fiB')) {
        output.push('fiB');
      }
    } else if (bigType === 'mc') {
      if (!output.includes('mc')) {
        output.push('mc');
      }
    } else if (bigType.includes('straight') || bigType === 'homo') {
      if (!output.includes('straight')) {
        output.push('straight');
      }
    } else if (bigType === 'longQ') {
      if (!output.includes('longQ')) {
        output.push('longQ');
      }
    } else {
      if (sandwich.fillings.length) {
        for (let filling of sandwich.fillings) {
          let fillingType = filling.type;
          if (fillingType.includes('fiB')) {
            if (!output.includes('fiB')) {
              output.push('fiB');
            }
          } else if (fillingType.includes('mc')) {
            if (!output.includes('mc')) {
              output.push('mc');
            }
          }
        }
      }
    }
  }
  return output;
}
