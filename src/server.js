const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
var cors = require("cors");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");
const path = require("path");
const connectDB = require("./config/connectDB");
const task = require("./helper/cronjobSendMail");
const task2 = require("./helper/cronjobVoucher");
const route = require("./router/index");
const swaggerSpec = require("../swagger/apiDoc");
const swaggerUI = require("swagger-ui-express");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(cookieParser());

//config body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect database
connectDB;

//Paypal
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AXOe7Uh36I9ocdaRnCfaUPllor09ZzA2-3sXxsTaYvJY3IzISbEJDnRqqVwIvAVajJdJB0qrtH3e-itD",
  client_secret:
    "EOLpJJrRbXD6QwSl0_-Q82RvrzvzDWAzO72DqQ4vDSO7oquXQrtxeLdzdEMVefO1Ah9pl74d8E8J_lKJ",
});

//config route
route(app);
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "../public")));

//config view engine
app.set("view engine", "ejs");

// cronjob
// run cron job send mail before 15' flash sale
task.start();
// cron job FLASHSALE AND VOUCHER
// task2.start();

app.set("views", path.join(__dirname, "../view"));
const methodOverride = require("method-override");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server run with port http://localhost:${port}/product`);
});

module.exports = app;
