const redis = require("redis");
const winston = require("../../config/winston");

const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_ADDRESS
);

client.on("error", (err) => {
  winston.info("redis Error: " + err);
});

module.exports = client;
