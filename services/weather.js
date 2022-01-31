const isEmpty = require("lodash/isEmpty");
const dayjs = require("dayjs");
const qs = require("qs");

const env = require("../config/config");
const axios = require("axios");
env();

const PAST_URL = process.env.OPENWEATHER_TIMEMACHINE_URL;
const ONECALL_URL = process.env.OPENWEATHER_ONECALL_URL;
const appid = process.env.OPENWEATHER_APP_ID;

const fetchPastWeather = async ({ lat, lon, date }) => {
  const query = qs.stringify({ lat, lon, dt: date, appid });
  const { data } = await axios.get(`${PAST_URL}?${query}`);
  return data.hourly || [data.current];
};

const fetchWeather = async ({ lat, lon }) => {
  const query = qs.stringify({ lat, lon, exclude: "minutely,alerts", appid });
  const { data } = await axios.get(`${ONECALL_URL}?${query}`);
  return data;
};

const getPastWeather = async (date, coords) => {
  if (isEmpty(coords)) {
    throw new Error("wrong params");
  }

  const today = date.unix();
  const yesterday = date.subtract(1, "day").unix();
  const twoDayAgo = date.subtract(2, "day").unix();

  const [untilTodayPastWeather, untilYesterdayPastWeather] = await Promise.all([
    fetchPastWeather({ ...coords, date: today }),
    (async () => {
      let data = await fetchPastWeather({ ...coords, date: yesterday });
      if (date.hour() >= 9) {
        const twoDayAgoData = await fetchPastWeather({
          ...coords,
          date: twoDayAgo,
        });
        // data.concat(twoDayAgoData);
        data = [...twoDayAgoData, ...data]
      }
      return data;
    })(),
  ]);

  return { untilTodayPastWeather, untilYesterdayPastWeather };
};

const getWeathers = async (coords) => {
  if (isEmpty(coords)) {
    throw new Error("wrong params");
  }
  const forecastWeather = await fetchWeather(coords);
  return forecastWeather;
};

module.exports = { getPastWeather, getWeathers };
