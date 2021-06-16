//UTC 2일전 15~24시 + UTC 1일전 0~15시 = GMT 1일전 0~24시
//UTC 1일전 15~24시 = GMT 당일 0~9시
//UTC 당일 0~15시 = GMT 당일 9~24시
//UTC 당일 15~24시 = GMT 1일후 0~9시
//UTC 1일후 0~15시 = GMT 1일후 9~24시
exports.parseToCombineArray = (data) => {
  const { yesterdayData, untilNowData, tomorrowData, dailyData, currentData, lastUpdate } = data;
  const a = yesterdayData.length === 8 ? 8 : 13;
  const b = 13 - a;
  const c = a === 8 ? a : yesterdayData.length;
  const d = untilNowData.length;
  const e = 8 - (c - a) - (d - b);

  //yesterdays
  const yesterdays = setCombine(yesterdayData, 5, a);
  setCombine(untilNowData, 0, b, yesterdays);

  //todays
  const todays = setCombine(yesterdayData, a, c);
  setCombine(untilNowData, b, d, todays);
  setCombine(tomorrowData, 0, e, todays);

  //tomorrows
  const tomorrows = setCombine(tomorrowData, e, e + 8);
  return {
    lastUpdate,
    yesterdays,
    todays,
    tomorrows,
    daily: dailyData,
    current: currentData,
  };
};

const setCombine = (data, start, end, days = undefined) => {
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
