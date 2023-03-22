const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
var cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./config/connectDB");
const task = require("./helper/cronjobSendMail");
const task2 = require("./helper/cronjobVoucher");
const route = require("./router/index");
const swaggerSpec = require("../swagger/apiDoc");
const swaggerUI = require("swagger-ui-express");

app.use(cors());

//config body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect database
connectDB;

//config route
route(app);

//config view engine
app.set("view engine", "ejs");

// cronjob
// task.start();
// task2.start();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server run with port ${port}`);
});

module.exports = app;
