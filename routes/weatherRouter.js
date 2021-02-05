const express = require("express");
const { getWeathers, isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");
const {
  parseToIndividualObject,
  parseToCombineArray,
} = require("../utils/parseData");

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.use("/:lat/:lon", isCache, getWeathers, async (req, res, next) => {
  next();
});

router.get("/:lat/:lon", (req, res) => {
  const weathers = parseToIndividualObject(req.filterData);
  setCache(req.key, weathers);

  res.send(weathers);
});

router.get("/:lat/:lon/parse", async (req, res) => {
  const weathers = parseToCombineArray(req.filterData);
  setCache(req.key, weathers);
  res.send(weathers);
});

module.exports = router;
