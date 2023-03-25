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
  app.use("/api/comment", CommentRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/product", ProductRouter);
  app.use("/api/flashsale", FlashSaleRouter);
  app.use("/api/order", OrderRouter);

  app.use(ErrorHandle);
}

module.exports = route;
