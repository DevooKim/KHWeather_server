exports.parseData = (data) => {
  const a = data.yData.length === 8 ? 8 : 13;
  const b = 13 - a;
  const d = a === 8 ? a : data.yData.length;
  const f = data.bData.length;
  const g = 8 - (d - a) - (f - b);

  const yesterdays = [...data.yData.slice(5, a), ...data.bData.slice(0, b)];
  const todays = [
    ...data.yData.slice(a, d),
    ...data.bData.slice(b, f),
    ...data.fData.slice(0, g),
  ];
  const tomorrows = [...data.fData.slice(g, g + 8)];

  const daily = data.dData;
  const current = data.cData;

  return { yesterdays, todays, tomorrows, daily, current };
};

exports.filterData = (dayjs, body, offset = 0, iter = 3) => {
  const result = [];
  try {
    for (let i = offset; i < body.length; i += iter) {
      let temp = body[i].temp;
      let feels_like = body[i].feels_like;
      const dt = dayjs.unix(body[i].dt).tz().format();

      if (typeof temp === "object") {
        for (let key in temp) {
          temp[key] = KtoC(temp[key]);
          feels_like[key] = KtoC(feels_like[key]);
        }
      } else {
        temp = KtoC(temp);
        feels_like = KtoC(feels_like);
      }

      result.push({ ...body[i], dt, temp, feels_like });
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  return result;
};

exports.getUnixTime = (time, offset) => {
  // time = time.subtract(2, "second"); //openweatherAPI server is late 2seconds
  return Math.floor(time.subtract(offset, "day") / 1000);
};

function KtoC(temp) {
  return Math.round(temp - 273.15);
}
