const dayjs = require("dayjs");
const UTC = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const toObject = require("dayjs/plugin/toObject");
const weekday = require("dayjs/plugin/weekday");
const winston = require("../config/winston");

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.extend(toObject);
dayjs.extend(weekday);
dayjs.tz.setDefault("Asia/Seoul");

exports.getDate = () => {
  return dayjs;
};

exports.filterData = (body, offset = 0, iter = 3) => {
  const result = [];
  try {
    for (let i = offset; i < body.length; i += iter) {
      let temp = body[i].temp;
      let feels_like = body[i].feels_like;
      // const dt = dayjs.unix(body[i].dt).tz().format();
      const dt = {
        ...dayjs.unix(body[i].dt).tz().toObject(),
        weekday: dayjs.unix(body[i].dt).tz().weekday(),
      };

      if (typeof temp === "object") {
        for (let key in temp) {
          temp[key] = KtoC(temp[key]);
          feels_like[key] = KtoC(feels_like[key]);
        }
      } else {
        temp = KtoC(temp);
        feels_like = KtoC(feels_like);
      }

      result.push({ ...body[i], dt, temp, feels_like });
    }
  } catch (error) {
    winston.error(error);
    throw new Error(error);
  }
  return result;
};

exports.getUnixTime = (time, offset) => {
  // time = time.subtract(2, "second"); //openweatherAPI server is late 2seconds
  return Math.floor(time.subtract(offset, "day") / 1000);
};

function KtoC(temp) {
  return Math.round(temp - 273.15);
}
