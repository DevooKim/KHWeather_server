const express = require("express");
const { isCache } = require("./func/cache");
const { getWeathers } = require("./middlewares");

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.get("/:lat/:lon", isCache, getWeathers, async (req, res) => {
  res.send(req.weathers);
});

router.get("/:lat/:lon/new", isCache, async (req, res) => {});

module.exports = router;
