const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8080;
var cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path")
const connectDB = require("./config/connectDB");
const task = require("./helper/cronjobSendMail");
const task2 = require("./helper/cronjobVoucher");
const route = require("./router/index");
const swaggerSpec = require("../swagger/apiDoc");
const swaggerUI = require("swagger-ui-express");
const cookieParser = require('cookie-parser') 

app.use(cors());
app.use(cookieParser())

//config body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect database
connectDB;

//config route
route(app);
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, '../public')));

//config view engine
app.set("view engine", "ejs");

// cronjob
// task.start();
// task2.start();
app.set('views',path.join(__dirname,'../view'));
const methodOverride = require('method-override')

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server run with port http://localhost:${port}/product`);
});

module.exports = app;
