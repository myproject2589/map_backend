import express from "express";
import cors from "cors";
import { APP_HOST, APP_PORT } from "./constants";
const mongoose = require("mongoose");
const config = require("config");
let log4js = require("log4js");
const logger = log4js.getLogger("Server");
let fileName = "logs/" + new Date().toDateString() + "_locationing.log";
let indexRouter = require("../routes/indexRoutes");
let jwt = require("jsonwebtoken");

log4js.configure({
  appenders: {
    fandango: {
      type: config.get("logger.type"),
      filename: fileName,
    },
  },
  categories: {
    default: {
      appenders: ["fandango"],
      level: config.get("logger.level"),
    },
  },
});

const app = express();
app.use(cors());
app.use(express.json());

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  res.json({
    message: err.message,
    type: "error"
  });
});

const checkTokenMiddleware = (req, res, next) => {
  // logger.debug("inside checkTokenMiddleware");

  const bearerToken = req.headers['authorization'];

  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized user. Token missing.' });
  }

  const token = bearerToken.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.get("token.secret"));
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Token validation failed:', error.message);
    return res.status(401).json({ message: 'Unauthorized user. Invalid token.' });
  }
};

// Apply the middleware to all routes that require a Bearer Token
//app.use(['/locations/getAllLocations', '/address/getAllAddress'], checkTokenMiddleware);

app.use("/", indexRouter);

let connectionString ='mongodb+srv://harish:y0bina7mHC6pj8QJ@cluster0.xrxo62r.mongodb.net/geolocationing'
  // "mongodb://localhost:" +
  // config.get("mongoDb.port") +
  // "/" +
  // config.get("mongoDb.dbname");

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Get the default connection
let dbConnect = mongoose.connection;

dbConnect.on("connected", () => {
  logger.debug("Database Connected...");
});

//Bind connection to error event (to get notification of connection errors)
dbConnect.on("error", (error) => {
  logger.error("Error in Database connection...");
  logger.error(error);
});

app.listen(Number(config.get("serverPort")), config.get("host"), () => {
  // logger.debug(`Listening on http://${config.get("host")}:${config.get("serverPort")}`)
})
