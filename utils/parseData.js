exports.parseToIndividualObject = (data) => {
  /*
    yesterdays: yData일부 + bData일부(옵션)
    todays: 남은 yData + 남은 bData + tData일부
    tomorrows: 남은 tData
   */
  const a = data.yData.length === 8 ? 8 : 13; //한국시간 0시 ~ 9시 => 8
  const b = 13 - a;
  const c = a === 8 ? a : data.yData.length;
  const d = data.bData.length;
  const e = 8 - (c - a) - (d - b);

  const yesterdays = [...data.yData.slice(5, a), ...data.bData.slice(0, b)];
  const todays = [
    ...data.yData.slice(a, c),
    ...data.bData.slice(b, d),
    ...data.tData.slice(0, e),
  ];
  const tomorrows = [...data.tData.slice(e, e + 8)];

  return {
    lastUpdate: data.lastUpdate,
    yesterdays,
    todays,
    tomorrows,
    daily: data.dData,
    current: data.cData,
  };
};

exports.parseToCombineArray = (data) => {
  const combined = {
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
  const cpCombined = combined;

  const a = data.yData.length === 8 ? 8 : 13; //한국시간 0시 ~ 9시 => 8
  const b = 13 - a;
  const c = a === 8 ? a : data.yData.length;
  const d = data.bData.length;
  const e = 8 - (c - a) - (d - b);

  //yesterdays
  setCombine(data.yData, 5, a, cpCombined);
  setCombine(data.bData, 0, b, cpCombined);

  //todays
  setCombine(data.yData, a, c, cpCombined);
  setCombine(data.bData, b, d, cpCombined);
  setCombine(data.tData, 0, e, cpCombined);

  //tomorrows
  setCombine(data.tData, e, e + 8, cpCombined);

  return {
    lastUpdate: data.lastUpdate,
    ...combined,
    daily: data.dData,
    current: data.cData,
  };
};

const setCombine = (data, start, end, combined) => {
  for (let i = start; i < end; i++) {
    combined.dt.push(data[i].dt);
    combined.temp.push(data[i].temp);
    combined.feels_like.push(data[i].feels_like);
    combined.humidity.push(data[i].humidity);
    combined.clouds.push(data[i].clouds);
    combined.visibility.push(data[i].visibility);
    combined.rain.push(data[i].rain);
    combined.snow.push(data[i].snow);
    combined.pop.push(data[i].pop);
    combined.weather.push(data[i].weather);
  }
};
