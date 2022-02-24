const chineseName: {[id: string]: string} = require('../json/chineseName.json');

export function getChineseName(chapterID: string): string {
  if (chapterID.length === 3) {
    return myMap[chapterID];
  } else {
    return chineseName[chapterID];
  }
}

const myMap: {[id: string]: string} = {
  '01a': '小一上',
  '02a': '小二上',
  '03a': '小三上',
  '04a': '小四上',
  '05a': '小五上',
  '06a': '小六上',
  '01b': '小一下',
  '02b': '小二下',
  '03b': '小三下',
  '04b': '小四下',
  '05b': '小五下',
  '06b': '小六下',
};
