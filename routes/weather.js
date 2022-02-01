const express = require("express");
const dayjs = require("dayjs");
const { isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");
const { parseToCombineArray } = require("../utils/parseData");
const { filterData } = require("../utils/utils");
const {
  getPastWeather,
  getWeathers,
} = require("../services/weather");

const router = express.Router();

router.get("/", isCache, async (req, res) => {
  const date = dayjs();
  const offset = 3 - (date.hour() % 3);

  const { untilTodayPastWeather, untilYesterdayPastWeather } =
    await getPastWeather(date, { lat: 36.35468, lon: 127.420997 });
  const { current, hourly, daily } = await getWeathers({
    lat: 36.35468,
    lon: 127.420997,
  });

  const weathers = {
    untilYesterdayPastData: filterData(untilYesterdayPastWeather),
    untilTodayPastData: filterData(untilTodayPastWeather),
    hourlyData: filterData(hourly, offset),
    dailyData: filterData(daily, 0, 1),
    currentData: filterData([current])[0],
  };

  const paredWeather = parseToCombineArray(weathers);
  setCache(req.key, paredWeather);
  res.send({weather: paredWeather, lastUpdate: date})
});

module.exports = router;
