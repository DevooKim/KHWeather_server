const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

// const weatherRouter = require("./routes/weatherRouter");
const router = require('./routes')

const env = require("./config/config");
env();

const app = express();
app.set("port", process.env.PORT || 8001);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", router);

app.use((req, res, next) => {
  const error = new Error("no Router");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "production" ? err : {};
  res.status(err.status || 500);
  res.send(err);
});

app.listen(app.get("port"), (err) => {
  if (!err) {
    // console.log("NODE_ENV: " + process.env.NODE_ENV);
    // console.log(app.get("port"), "번 포트에서 대기 중");
  } else {
    throw new Error("서버 오류", err);
  }
});
