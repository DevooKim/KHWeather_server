const express = require("express");
const { getWeathers, isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");
const { parseData } = require("../utils/utils");

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.use("/:lat/:lon", isCache, getWeathers, async (req, res, next) => {
  next();
});

router.get("/:lat/:lon", (req, res) => {
  const weathers = parseData(req.filterData);
  setCache(req.key, weathers);

  res.send(weathers);
});

router.get("/:lat/:lon/new", async (req, res) => {
  res.send(req.filterData);
});

module.exports = router;
