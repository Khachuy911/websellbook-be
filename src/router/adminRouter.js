const express = require('express');
const Route = express.Router();
const AdminController = require('../controller/adminController');
const Auth = require('../middleware/authMiddleware');

Route.get('/list-users', Auth.checkToken, AdminController.ListUser);
Route.get('/list-products', Auth.checkToken, AdminController.ListProduct);
Route.get('/dashboard', Auth.checkToken, AdminController.DashBoard);
Route.get('/user', Auth.checkToken, AdminController.User);
Route.get('/list-orders', Auth.checkToken, AdminController.ListOrders);



module.exports = Route;
