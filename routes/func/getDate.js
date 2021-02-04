const dayjs = require("dayjs");
const UTC = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

exports.getDate = () => {
  dayjs.extend(UTC);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Seoul");
  return dayjs;
};
