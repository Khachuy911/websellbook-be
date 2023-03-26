const express = require('express');
const Route = express.Router();
const AdminController = require('../controller/adminController');

Route.get('/list-user', AdminController.ListUser);



module.exports = Route;
