const intervals = [
  {label: '年', seconds: 31536000},
  {label: '個月', seconds: 2592000},
  {label: '日', seconds: 86400},
  {label: '今天', seconds: -1},
];

export function timeSince(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find(i => i.seconds < seconds);
  if (interval) {
    const count = Math.floor(seconds / interval.seconds);

    return `${interval!.label !== '今天' ? count : ''}${interval.label}${
      interval!.label !== '今天' ? '前' : ''
    }`;
  } else {
    return '';
  }
}
