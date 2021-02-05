const express = require("express");
const { getWeathers, isCache } = require("./middlewares");
const { setCache } = require("./utils/caching");

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.use("/:lat/:lon", isCache, getWeathers, async (req, res, next) => {
  next();
});

router.get("/:lat/:lon", (req, res, next) => {
  const { yData, bData, tData, dData, cData, lastUpdate } = req.filterData;
  const bLength = bData.length;
  const tIndex = 8 - (bLength - 5);

  const yesterdays = [...yData.slice(5, 8), ...bData.slice(0, 5)]; //index fix
  const todays = [...bData.slice(5, bLength), ...tData.slice(0, tIndex)];
  const tomorrows = tData.slice(tIndex, tIndex + 8);

  const daily = dData;
  const current = cData;

  const weathers = {
    yesterdays,
    todays,
    tomorrows,
    daily,
    current,
    lastUpdate,
  };
  console.log(tData);

  setCache(req.key, weathers);
  res.send(weathers);
});

// router.get("/:lat/:lon", isCache, async (req, res) => {
//   getWeathers();
//   parseDataDefault();
//   setCache(req.key, req.weathers);
//   res.send(req.weathers);
// });

router.get("/:lat/:lon/new", async (req, res) => {
  res.send(req.filterData);
});

module.exports = router;
