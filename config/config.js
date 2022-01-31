const dotenv = require("dotenv");
const path = require("path");

module.exports = () => {
  if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } else if (process.env.NODE_ENV === "develop") {
    // dotenv.config({ path: path.resolve(process.cwd(), ".env.develop.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } else if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  } else {
    throw new Error("Not config NODE_ENV");
  }
};
