const dayjs = require("dayjs");
const UTC = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const { getHistory, getForecasts } = require("./func/request");
const { setCache } = require("./func/cache");
const { filterData, parseData, getUnixTime } = require("../utils/funcData");
const winston = require("../config/winston");

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

exports.getWeathers = async (req, res, next) => {
  const time = dayjs.tz();
  const offset = 3 - (time.hour() % 3);
  const { lat, lon } = req.params;
  const location = { lat: lat, lon: lon };
  const key = req.key;

  const [history, future] = await Promise.all([
    getHistory(time, location, getUnixTime),
    getForecasts(location),
  ]);

  const [yesterdays, befores] = history;
  const [current, forecasts, daily] = future;

  const yData = filterData(dayjs, yesterdays);
  const bData = filterData(dayjs, befores);
  const fData = filterData(dayjs, forecasts, offset);
  const dData = filterData(dayjs, daily, 0, 1);
  const cData = filterData(dayjs, [current]);

  let parse = parseData({ yData, bData, fData, dData, cData });
  parse = { lastUpdate: time.format(), ...parse };

  winston.info("caching ok...");
  setCache(key, parse);

  req.weathers = parse;

  next();
};
