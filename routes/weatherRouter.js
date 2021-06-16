const express = require("express");
const { getWeathers, isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");
const { parseToCombineArray } = require("../utils/parseData");

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.get("/:lat/:lon", isCache, getWeathers, async (req, res) => {
  const weathers = parseToCombineArray(req.filterData);
  setCache(req.key, weathers);
  res.send(weathers);
});

module.exports = router;
