//UTC 2일전 15~21시 + UTC 1일전 0~15시 = GMT 1일전 0~24시
//UTC 1일전 15~21시 = GMT 당일 0~9시
//UTC 당일 0~15시 = GMT 당일 9~24시
//UTC 당일 15~21시 = GMT 1일후 0~9시
//UTC 1일후 0~15시 = GMT 1일후 9~24시
exports.parseToCombineArray = (data) => {
  const {
    untilYesterdayPastData,
    untilTodayPastData,
    hourlyData,
    dailyData,
    currentData,
  } = data;
  const a = untilYesterdayPastData.length === 8 ? 8 : 13;
  const b = 13 - a;
  const c = a === 8 ? a : untilYesterdayPastData.length;
  const d = untilTodayPastData.length;
  const e = 8 - (c - a) - (d - b);

  //yesterdays
  let yesterdays = setCombine(5, a, untilYesterdayPastData);
  yesterdays = setCombine(0, b, untilTodayPastData, yesterdays);

  //todays
  let todays = setCombine(a, c, untilYesterdayPastData);
  todays = setCombine(b, d, untilTodayPastData, todays);
  todays = setCombine(0, e, hourlyData, todays);

  // //tomorrows
  const tomorrows = setCombine(e, e + 8, hourlyData);

  return {
    yesterdays,
    todays,
    tomorrows,
    daily: dailyData,
    current: currentData,
  };
};

const setCombine = (start, end, data, target = []) => {
  const spliced = data.slice(start, end);
  const concated = target.concat(spliced);
  return concated;
};
