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

// exports.getDate = () => {
// return dayjs;
// };

exports.filterData = (data, offset = 0, iter = 3) => {
  const result = [];
  try {
    for (let i = offset; i < data.length; i += iter) {
      // const dt = dayjs.unix(data[i].dt).tz().format();
      const dt = {
        ...dayjs.unix(data[i].dt).tz().toObject(),
        weekday: dayjs.unix(data[i].dt).tz().weekday(),
      };
      console.log(dayjs.unix(data[i].dt).hour())

      let temp = data[i].temp;
      let feelsLike = data[i].feels_like;

      if (typeof temp === "object") {
        for (let key in temp) {
          temp[key] = KtoC(temp[key]);
          feelsLike[key] = KtoC(feelsLike[key]);
        }
      } else {
        temp = KtoC(temp);
        feelsLike = KtoC(feelsLike);
      }

      result.push({ ...data[i], dt, temp, feelsLike });
    }
  } catch (error) {
    winston.error(error);
    throw new Error(error);
  }
  console.log('---')
  return result;
};

exports.getUnixTime = (time, offset) => {
  // time = time.subtract(2, "second"); //openweatherAPI server is late 2seconds
  return Math.floor(time.subtract(offset, "day") / 1000);
};

function KtoC(temp) {
  return Math.round(temp - 273.15);
}
