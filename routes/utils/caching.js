const client = require("../config/client");
const env = require("../../config/config");

env();
const EX = process.env.CACHE_EXPIRE;
exports.setCache = (key, data) => {
  client.hset(key, "data", JSON.stringify(data));

  client.expire(key, EX);
};
