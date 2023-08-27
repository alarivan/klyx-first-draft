const padZero = (n: number) => {
  if (n < 10) {
    return `0${n}`;
  }
  return n;
};

export const formatSecondsToTime = (value: number) => {
  const minutes = padZero(Math.floor(value / 60));
  const seconds = padZero(value % 60);
  return `${minutes}:${seconds}`;
};
