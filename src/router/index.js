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

function route(app) {
  app.use("/admin", AdminRouter);
  app.use("/comment", CommentRouter);
  app.use("/auth", AuthRouter);
  app.use("/user", UserRouter);
  app.use("/voucher", VoucherRouter);
  app.use("/category", CategoryRouter);
  app.use("/product", ProductRouter);
  app.use("/flashsale", FlashSaleRouter);
  app.use("/cart", CartRouter);
  app.use("/order", OrderRouter);

  app.use(ErrorHandle);
}

module.exports = route;
