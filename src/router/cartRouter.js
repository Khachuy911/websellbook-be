const express = require("express");
const Route = express.Router();

const CartController = require("../controller/cartController");
const Auth = require("../middleware/authMiddleware");
const AsyncHandle = require("../middleware/asyncHandle");
const upload = require("../middleware/multer");
const { DEFAULT_VALUE } = require("../helper/constant");

// Route.delete('/deletesoft/:id', Auth.checkToken, AsyncHandle(CommentController.deleteSoft));

Route.route("/:id");
// .patch(Auth.checkToken, AsyncHandle(CommentController.update))
// .get(AsyncHandle(CommentController.getDetail))

Route.route("/")
  .get(Auth.checkToken, AsyncHandle(CartController.getCart))
  .post(Auth.checkToken, AsyncHandle(CartController.create));

module.exports = Route;
