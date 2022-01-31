//UTC 2일전 15~24시 + UTC 1일전 0~15시 = GMT 1일전 0~24시
//UTC 1일전 15~24시 = GMT 당일 0~9시
//UTC 당일 0~15시 = GMT 당일 9~24시
//UTC 당일 15~24시 = GMT 1일후 0~9시
//UTC 1일후 0~15시 = GMT 1일후 9~24시
exports.parseToCombineArray = (data) => {
  const { untilYesterdayPastData, untilTodayPastData, hourlyData, dailyData, currentData } = data;
  const a = untilYesterdayPastData.length === 8 ? 8 : 13;
  const b = 13 - a;
  const c = a === 8 ? a : untilYesterdayPastData.length;
  const d = untilTodayPastData.length;
  const e = 8 - (c - a) - (d - b);
  console.log(a, b, c, d, e)
  //yesterdays
  const yesterdays = setCombine(untilYesterdayPastData, 5, a);
  console.log(1)
  setCombine(untilTodayPastData, 0, b, yesterdays, 2);
  console.log(2)

  //todays
  const todays = setCombine(untilYesterdayPastData, a, c);
  console.log(3)
  setCombine(untilTodayPastData, b, d, todays);
  console.log(4)
  setCombine(hourlyData, 0, e, todays);

  //tomorrows
  const tomorrows = setCombine(hourlyData, e, e + 8);
  return {
    yesterdays,
    todays,
    tomorrows,
    daily: dailyData,
    current: currentData,
  };
};

const setCombine = (data, start, end, days, key) => {
  if (!days) {
    days = {
      dt: [],
      temp: [],
      feels_like: [],
      humidity: [],
      clouds: [],
      visibility: [],
      rain: [],
      snow: [],
      pop: [],
      weather: [],
    };
  }

  // if(key ===2) {
  //   console.log('parse: ', end,)
  // }
  for (let i = start; i < end; i++) {
    days.dt.push(data[i].dt);
    days.temp.push(data[i].temp);
    days.feels_like.push(data[i].feels_like);
    days.humidity.push(data[i].humidity);
    days.clouds.push(data[i].clouds);
    days.visibility.push(data[i].visibility);
    days.rain.push(data[i].rain);
    days.snow.push(data[i].snow);
    days.pop.push(data[i].pop);
    days.weather.push(data[i].weather);
  }
  return days;
};
