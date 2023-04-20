const ErrorHandle = require("../middleware/errorHandle");
const AuthRouter = require("./authRouter");
const UserRouter = require("./userRouter");
const VoucherRouter = require("./voucherRouter");
const CategoryRouter = require("./categoryRouter");
const ProductRouter = require("./productRouter");
const FlashSaleRouter = require("./flashSaleRouter");
const OrderRouter = require("./orderRouter");
const CommentRouter = require("./commentRouter");
const AdminRouter = require("./adminRouter");
const CartRouter = require("./cartRouter");
const Auth = require("../middleware/authMiddleware");

function route(app) {
  app.use("/admin",Auth.checkLogin, AdminRouter);
  app.use("/comment",Auth.checkLogin, CommentRouter);
  app.use("/auth",Auth.checkLogin, AuthRouter);
  app.use("/user",Auth.checkLogin, UserRouter);
  app.use("/voucher",Auth.checkLogin, VoucherRouter);
  app.use("/category",Auth.checkLogin, CategoryRouter);
  app.use("/product",Auth.checkLogin, ProductRouter);
  app.use("/flashsale",Auth.checkLogin, FlashSaleRouter);
  app.use("/cart",Auth.checkLogin, CartRouter);
  app.use("/order",Auth.checkLogin, OrderRouter);

  app.use(ErrorHandle);
}

module.exports = route;
