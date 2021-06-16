exports.parseToCombineArray = (data) => {
  const a = data.yData.length === 8 ? 8 : 13; //한국시간 0시 ~ 9시 => 8
  const b = 13 - a;
  const c = a === 8 ? a : data.yData.length;
  const d = data.bData.length;
  const e = 8 - (c - a) - (d - b);

  //yesterdays
  const yesterdays = setCombine(data.yData, 5, a);
  setCombine(data.bData, 0, b, yesterdays);

  //todays
  const todays = setCombine(data.yData, a, c);
  setCombine(data.bData, b, d, todays);
  setCombine(data.tData, 0, e, todays);

  //tomorrows
  const tomorrows = setCombine(data.tData, e, e + 8);

  return {
    lastUpdate: data.lastUpdate,
    yesterdays,
    todays,
    tomorrows,
    daily: data.dData,
    current: data.cData,
  };
};

const setCombine = (data, start, end, days = undefined) => {
  if (days === undefined) {
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
