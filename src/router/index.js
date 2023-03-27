
const AdminMiddleware = require("../middleware/adminMiddleware");
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

function route(app) {
  app.use("/admin",AdminMiddleware.checkUser,AdminMiddleware.checkAdmin,AdminRouter);
  app.use("/api/comment", CommentRouter);
  app.use("/auth", AuthRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/product", ProductRouter);
  app.use("/api/flashsale", FlashSaleRouter);
  app.use("/api/order", OrderRouter);

  app.use(ErrorHandle);
}

module.exports = route;
