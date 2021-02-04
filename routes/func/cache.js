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

exports.setCache = (key, data) => {
  client.hset(key, "data", JSON.stringify(data));

  client.expire(key, EX);
};

function getKey(lat, lon) {
  return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}
