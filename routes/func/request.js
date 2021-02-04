const rp = require("request-promise-native");
const env = require("../../config/config");
env();

const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getHistory = async (time, location, getUnixTime) => {
  const unixTime = {
    today: getUnixTime(time, 0),
    yesterday: getUnixTime(time, 1),
    twoDayAgo: getUnixTime(time, 2),
  };

  let [befores, yesterdays] = await Promise.all([
    rqHistory(location, unixTime.today),
    rqHistory(location, unixTime.yesterday),
  ]);
  if (time.hour() >= 9) {
    const secondYesterdays = await rqHistory(location, unixTime.twoDayAgo);
    yesterdays = [...yesterdays, ...secondYesterdays];
  }

  return { yesterdays, befores };
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
      appid: apiKey,
    },
  });

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
      appid: apiKey,
    },
  });

  const result = JSON.parse(data);

  return {
    current: result.current,
    forecasts: result.hourly,
    daily: result.daily,
  };
}
