const redis = require("redis");
const env = require("../../config/config");
const winston = require("../../config/winston");

env();
const EX = process.env.CACHE_EXPIRE;

const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_ADDRESS
);

client.on("error", (err) => {
  winston.info("redis Error: " + err);
});

exports.isCache = (req, res, next) => {
  //   const key = getKey(req.body.lat, req.body.lon);
  const key = getKey(req.params.lat, req.params.lon);
  req.key = key;

  winston.info(`check cache ${key}`);
  client.lrange(key, 0, -1, (err, arr) => {
    if (err) throw err;

    if (arr.length !== 0) {
      const weather = parseData(arr);
      winston.info("call cache OK");
      res.send(weather);
    } else {
      winston.info("not cached");
      next();
    }
  });
};

exports.setCache = (dayjs, key, body, offset = 0, iter = 3) => {
  const result = [];
  try {
    for (let i = offset; i < body.length; i += iter) {
      let temp = body[i].temp;
      let feels_like = body[i].feels_like;
      if (typeof temp === "object") {
        for (let key in temp) {
          temp[key] = KtoC(temp[key]);
          feels_like[key] = KtoC(feels_like[key]);
        }
      } else {
        temp = KtoC(temp);
        feels_like = KtoC(feels_like);
      }

      const dt = dayjs.unix(body[i].dt).tz().format();
      const data = { ...body[i], dt, temp, feels_like };

      result.push(data);
      client.rpush(key, JSON.stringify(data));
    }

    winston.info("set Cache OK");
    client.expire(key, EX);
  } catch (error) {
    winston.error("setCache Error: " + error);
  }

  return result;
};

function parseData(data) {
  const weathers = {
    yesterdays: [],
    todays: [],
    tomorrows: [],
    daily: [],
  };

  weathers.yesterdays = data.slice(5, 13).map((v) => {
    return JSON.parse(v);
  });
  weathers.todays = data.slice(13, 21).map((v) => {
    return JSON.parse(v);
  });
  weathers.tomorrows = data.slice(21, 29).map((v) => {
    return JSON.parse(v);
  });
  weathers.daily = data.slice(data.length - 8, data.length - 1).map((v) => {
    return JSON.parse(v);
  });
  weathers.current = JSON.parse(data[data.length - 1]);

  return weathers;
}

function getKey(lat, lon) {
  return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}

function KtoC(temp) {
  return Math.round(temp - 273.15);
}
