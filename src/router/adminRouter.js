const express = require('express');
const Route = express.Router();
const AdminController = require('../controller/adminController');
const Auth = require('../middleware/authMiddleware');

Route.get('/list-user', Auth.checkToken, AdminController.ListUser);



module.exports = Route;
