export function getYearTermChinese(year: string, term: string) {
  if (year === '' || term === '') {
    return '';
  }
  const yearTerm = year + term;

  return YearTermMap[yearTerm];
}

const YearTermMap: any = {
  '1a': '小一上',
  '1b': '小一下',
  '2a': '小二上',
  '2b': '小二下',
  '3a': '小三上',
  '3b': '小三下',
  '4a': '小四上',
  '4b': '小四下',
  '5a': '小五上',
  '5b': '小五下',
  '6a': '小六上',
  '6b': '小六下',
};
