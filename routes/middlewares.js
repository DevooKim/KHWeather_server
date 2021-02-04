const { getHistory, getForecasts } = require("./func/request");
const { setCache } = require("./func/cache");
const winston = require("../config/winston");
const { getDate } = require("./func/getDate");

exports.getWeathers = async (req, res, next) => {
  const time = getDate().tz();
  const offset = 3 - (time.hour() % 3);
  const { lat, lon } = req.params;
  const location = { lat: lat, lon: lon };
  const key = req.key;

  const [history, future] = await Promise.all([
    getHistory(time, location, getUnixTime),
    getForecasts(location),
  ]);

  const { yesterdays, befores } = history;
  const { current, forecasts, daily } = future;

  const yData = filterData(yesterdays);
  const bData = filterData(befores);
  const fData = filterData(forecasts, offset);
  const dData = filterData(daily, 0, 1);

  const cData = filterData([current]);

  let parse = parseData({ yData, bData, fData, dData, cData });
  parse = { lastUpdate: time.format(), ...parse };
  setCache(key, parse);
  winston.info("caching ok...");
  req.weathers = parse;

  next();
};

function parseData(data) {
  const bLength = data.bData.length;
  const fIndex = 8 - (bLength - 5);

  const yesterdays = [...data.yData.slice(5, 8), ...data.bData.slice(0, 5)]; //index fix
  const todays = [
    ...data.bData.slice(5, bLength),
    ...data.fData.slice(0, fIndex),
  ];
  const tomorrows = data.fData.slice(fIndex, fIndex + 8);

  const daily = data.dData;
  const current = data.cData;

  return { yesterdays, todays, tomorrows, daily, current };
}

function filterData(body, offset = 0, iter = 3) {
  const result = [];
  try {
    for (let i = offset; i < body.length; i += iter) {
      let temp = body[i].temp;
      let feels_like = body[i].feels_like;
      const dt = getDate().unix(body[i].dt).tz().format();

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

    winston.info("filter OK");
  } catch (error) {
    winston.error("filter Error: " + error);
  }
  return result;
}

function KtoC(temp) {
  return Math.round(temp - 273.15);
}

function getUnixTime(time, offset) {
  // time = time.subtract(2, "second"); //openweatherAPI server is late 2seconds
  return Math.floor(time.subtract(offset, "day") / 1000);
}
