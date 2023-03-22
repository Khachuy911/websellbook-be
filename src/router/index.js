const ErrorHandle = require("../middleware/errorHandle");
const AuthRouter = require("./authRouter");
const UserRouter = require("./userRouter");
const VoucherRouter = require("./voucherRouter");
const CategoryRouter = require("./categoryRouter");
const ProductRouter = require("./productRouter");
const FlashSaleRouter = require("./flashSaleRouter");
const OrderRouter = require("./orderRouter");
const CommentRouter = require("./commentRouter");

function route(app) {
  app.use("/comment", CommentRouter);
  app.use("/auth", AuthRouter);
  app.use("/user", UserRouter);
  app.use("/voucher", VoucherRouter);
  app.use("/category", CategoryRouter);
  app.use("/product", ProductRouter);
  app.use("/flashsale", FlashSaleRouter);
  app.use("/order", OrderRouter);

  app.use(ErrorHandle);
}

module.exports = route;
