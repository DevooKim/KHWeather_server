const winston = require("../config/winston");
const client = require("./config/client");

exports.isCache = (req, res, next) => {
  const key = getKey(req.query.lat, req.query.lon);
  req.key = key;

  winston.info(`check cache>> lat: ${req.query.lat} lon: ${req.query.lon}`);
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

function getKey(lat, lon) {
  return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}
