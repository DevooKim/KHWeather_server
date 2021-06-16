const { getHistory, getForecasts } = require("./utils/request");
const { filterData } = require("../utils/utils");
const winston = require("../config/winston");
const { getDate } = require("../utils/utils");
const client = require("./config/client");

exports.isCache = (req, res, next) => {
  const key = getKey(req.params.lat, req.params.lon);
  req.key = key;

  winston.info(`check cache>> lat: ${req.params.lat} lon: ${req.params.lon}`);
  client.hgetall(key, (err, obj) => {
    if (err) throw err;
    if (obj) {
      winston.info("call cache");
      res.send(JSON.parse(obj.data));
    } else {
      winston.info("not cached");
      next();
    }
  });
};

exports.getWeathers = async (req, res, next) => {
  const time = getDate().tz();
  const offset = 3 - (time.hour() % 3);
  const { lat, lon } = req.params;
  const location = { lat: lat, lon: lon };

  const [history, future] = await Promise.all([getHistory(time, location), getForecasts(location)]);

  const { yesterdays, untilNow } = history;
  const { current, tomorrows, daily } = future;

  const yesterdayData = filterData(yesterdays);
  const untilNowData = filterData(untilNow);
  const tomorrowData = filterData(tomorrows, offset);
  const dailyData = filterData(daily, 0, 1);
  const currentData = filterData([current]);

  req.filterData = {
    yesterdayData,
    untilNowData,
    tomorrowData,
    dailyData,
    currentData,
    lastUpdate: time,
  };

  next();
};

function getKey(lat, lon) {
  return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}
