const rp = require("request-promise-native");
const env = require("../../config/config");
const { getUnixTime } = require("../../utils/utils");
env();

const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getHistory = async (time, location) => {
  const unixTime = {
    today: getUnixTime(time, 0),
    yesterday: getUnixTime(time, 1),
    twoDayAgo: getUnixTime(time, 2),
  };

  let [untilNow, yesterdays] = await Promise.all([
    rqHistory(location, unixTime.today),
    rqHistory(location, unixTime.yesterday),
  ]);
  if (time.hour() >= 9) {
    const secondYesterdays = await rqHistory(location, unixTime.twoDayAgo);
    yesterdays = [...secondYesterdays, ...yesterdays];
  }

  return { yesterdays, untilNow };
};

exports.getForecasts = async (location) => {
  return await rqForecasts(location);
};

async function rqHistory(location, time) {
  const response = await rp({
    uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
    qs: {
      lat: location.lat,
      lon: location.lon,
      dt: time,
      // appid: apiKey,
      appid: location.appid,
    },
  });
  console.log(response)
  const data = JSON.parse(response);

  if (data.hourly === undefined) {
    return [data.current];
  } else {
    return data.hourly;
  }
}

async function rqForecasts(location) {
  const data = await rp({
    uri: "https://api.openweathermap.org/data/2.5/onecall",
    qs: {
      lat: location.lat,
      lon: location.lon,
      exclude: "minutely,alerts",
      // appid: apiKey,
      appid: location.appid,
    },
  });
  const result = JSON.parse(data);
  console.log(result)

  return {
    current: result.current,
    tomorrows: result.hourly,
    daily: result.daily,
  };
}
