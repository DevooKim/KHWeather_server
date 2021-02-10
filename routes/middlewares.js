const { getHistory, getForecasts } = require("./utils/request");
const { filterData, getUnixTime } = require("../utils/utils");
const winston = require("../config/winston");
const { getDate } = require("../utils/utils");
const client = require("./config/client");

exports.isCache = (req, res, next) => {
  const coord = getKey(req.params.lat, req.params.lon);
  const type = req._parsedUrl.path.split("/");
  const key = coord + type[3];
  req.key = key;

  winston.info(`type: ${type[3]} --------------------------`);
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

  const [history, future] = await Promise.all([
    getHistory(time, location, getUnixTime),
    getForecasts(location),
  ]);

  const { yesterdays, befores } = history;
  const { current, tomorrows, daily } = future;

  const yData = filterData(yesterdays);
  const bData = filterData(befores);
  const tData = filterData(tomorrows, offset);
  const dData = filterData(daily, 0, 1);
  const cData = filterData([current]);

  req.filterData = {
    yData,
    bData,
    tData,
    dData,
    cData,
    lastUpdate: time,
  };

  next();
};

function getKey(lat, lon) {
  return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}
