const dayjs = require("dayjs");
const UTC = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { getHistory, getForecasts } = require("./func/request");
const { setCache } = require("./func/cache");
const winston = require("../config/winston");

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

<<<<<<< HEAD
exports.getYesterdays = async (req, res, next) => {
    const kor = dayjs.tz();
    const { lat, lon } = req.params;
    const key = req.key;
    const location = { lat: lat, lon: lon }

    let unixTime = await getUnixTime(1);
    let yesterdays = await rqHistory(location, unixTime);
    console.log(yesterdays.length);

    if (kor.hour() >= 9) {
        unixTime = await getUnixTime(2);
        const secondYesterdays = await rqHistory(location, unixTime);
        yesterdays = yesterdays.concat(secondYesterdays)
    }
    console.log(yesterdays.length);
    
    console.log("yesterdays caching...");
    yesterdays = await setCache(key, yesterdays);
    req.yesterdays = yesterdays;
    next();  
}

exports.getBefores = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = req.key;

    const location = { lat: lat, lon: lon }
    const unixTime = await getUnixTime(0);
    let befores = await rqHistory(location, unixTime);

    console.log("befores caching...");
    befores = await setCache(key, befores);
    req.befores = befores;
    next();
}

exports.getForecasts = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = req.key;

    const location = { lat: lat, lon: lon }
    let forecasts = await rqForecasts(location);
    
    const kor = dayjs.tz();
    const start = 3 - ( kor.hour() % 3 );

    console.log("forecasts caching...");
    forecasts = await setCache(key, forecasts, start);
    req.forecasts = forecasts;
    next();
}
=======
exports.getWeathers = async (req, res, next) => {
  const time = dayjs.tz();
  const offset = 3 - (time.hour() % 3);
  const { lat, lon } = req.body;
  const location = { lat: lat, lon: lon };
  const key = req.key;

  //   const [yesterdays, befores] = await getHistory(time, location, getUnixTime);
  //   const [forecasts, daily] = await getForecasts(location);

  const [history, future] = await Promise.all([
    getHistory(time, location, getUnixTime),
    getForecasts(location),
  ]);

  const [yesterdays, befores] = history;
  const [forecasts, daily] = future;

  winston.info("yesterdays caching...");
  const yData = setCache(dayjs, key, yesterdays);

  winston.info("befores caching...");
  const bData = setCache(dayjs, key, befores);

  winston.info("forecasts caching...");
  const fData = setCache(dayjs, key, forecasts, offset);

  winston.info("daily caching...");
  const dData = setCache(dayjs, key, daily, 0, 1);
>>>>>>> main

  req.yesterdays = yData;
  req.befores = bData;
  req.forecasts = fData;
  req.daily = dData;

  next();
};

function getUnixTime(time, offset) {
  // time = time.subtract(2, 'second');   //openweatherAPI server is late 2seconds
  return Math.floor(time.subtract(offset, "day") / 1000);
}
