const express = require("express");
const dayjs = require("dayjs");
const { isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");
const { parseToCombineArray } = require("../utils/parseData");
const { getDate, getUnixTime, filterData } = require("../utils/utils");
const { getForecasts } = require("./utils/request");
const {
  getPastWeather,
  getWeathers,
} = require("../services/weather");

const router = express.Router();
const apiKey = "00c066bda0c6f600f2e440be2165e693";

// router.get("/week", isCache, getWeathers, async (req, res) => {
router.get("/", async (req, res) => {
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
    currentData: filterData([current]),
  };

  const paredWeather = parseToCombineArray(weathers);
  setCache(req.key, paredWeather);

  // res.json(paredWeather);
  res.json(weathers.untilTodayPastData)
});

//lat, lon: 36.354687/127.420997
// router.get("/:lat/:lon", isCache, getWeathers, async (req, res) => {
//   const weathers = parseToCombineArray(req.filterData);
//   setCache(req.key, weathers);
//   res.send(weathers);
// });

module.exports = router;
