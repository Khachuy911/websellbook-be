const express = require('express');
const Route = express.Router();
const AdminController = require('../controller/adminController');
const Auth = require('../middleware/authMiddleware');

Route.get('/list-users', Auth.checkToken, AdminController.ListUser);
Route.get('/list-products', Auth.checkToken, AdminController.ListProduct);
Route.get('/dashboard', Auth.checkToken, AdminController.DashBoard);
Route.get('/list-orders', Auth.checkToken, AdminController.ListOrders);
Route.get('/list-voucher', Auth.checkToken, AdminController.ListVoucher);
Route.get('/list-comment', Auth.checkToken, AdminController.ListComment);
Route.get('/list-flashsale', Auth.checkToken, AdminController.ListFlashSale);
Route.get('/list-catogery', Auth.checkToken, AdminController.ListCatogery);



module.exports = Route;
