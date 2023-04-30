const express = require("express");
const Route = express.Router();

const OrderController = require("../controller/orderController");
const AsyncHandle = require("../middleware/asyncHandle");
const Auth = require("../middleware/authMiddleware");
const { DEFAULT_VALUE } = require("../helper/constant");

Route.get("/dashboard", AsyncHandle(OrderController.dashboard));

Route.patch("/exportData/:order", AsyncHandle(OrderController.exportData));

Route.get("/exportData", AsyncHandle(OrderController.exportData));
Route.post("/paypal", AsyncHandle(OrderController.paypal));

Route.get("/viewPaypal", (req, res, next) => {
  res.render("../view/paypal.ejs");
});

Route.get("/success", AsyncHandle(OrderController.paypalSuccess));


Route.patch(
  "/confirm/:id",
  Auth.checkToken,
  Auth.permission(
    "/order/confirm/:id/",
    DEFAULT_VALUE.EDIT,
    DEFAULT_VALUE.READ
  ),
  AsyncHandle(OrderController.confirmStauts)
);
Route.patch(
  "/shipping/:id",
  Auth.checkToken,
  Auth.permission(
    "/order/shipping/:id/",
    DEFAULT_VALUE.EDIT,
    DEFAULT_VALUE.READ
  ),
  AsyncHandle(OrderController.shippingStauts)
);
Route.patch(
  "/delivere/:id",
  Auth.checkToken,
  Auth.permission(
    "/order/delivere/:id/",
    DEFAULT_VALUE.EDIT,
    DEFAULT_VALUE.READ
  ),
  AsyncHandle(OrderController.delivereStauts)
);
Route.patch(
  "/done/:id",
  Auth.checkToken,
  Auth.permission("/order/done/:id/", DEFAULT_VALUE.EDIT, DEFAULT_VALUE.READ),
  AsyncHandle(OrderController.doneStauts)
);
Route.delete(
  "/cancel/:id",
  Auth.checkToken,
  AsyncHandle(OrderController.cancelOrder)
);
Route.get("/myorder", Auth.checkToken, AsyncHandle(OrderController.getMyOrder));
Route.get("/export/:id", AsyncHandle(OrderController.getDetailToExport));
Route.get("/:id", Auth.checkToken, AsyncHandle(OrderController.getDetail));

Route.get(
  "/",
  Auth.checkToken,
  Auth.permission(
    "/order/",
    DEFAULT_VALUE.EDIT,
    DEFAULT_VALUE.READ,
    DEFAULT_VALUE.DELETE
  ),
  AsyncHandle(OrderController.getOrder)
);
Route.post("/", Auth.checkToken, AsyncHandle(OrderController.create));

/**
 * @swagger
 * tags:
 *  name: ORDER
 *  description: API OF ORDER
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Order:
 *              type: object
 *              properties:
 *                  product:
 *                      type: string
 *                      example: [{id, quantity}]
 *                  voucherCode:
 *                      type: string
 *
 */

/**
 * @swagger
 * /order/:
 *  post:
 *      summary: create a new order
 *      description: post a new order
 *      tags: [ORDER]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Order'
 *      responses:
 *          '201':
 *              description: create success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              isSuccess:
 *                                  example: true
 *                              message:
 *                                  example: Created successfully
 *                              data:
 *                                  example: {}
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/:
 *  get:
 *      summary: return list of the order
 *      description: get all order
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: page
 *        - in: query
 *          name: title
 *        - in: query
 *          name: type
 *        - in: query
 *          name: status
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/{id}:
 *  get:
 *      summary: return a order
 *      description: get a order by id
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/myorder:
 *  get:
 *      summary: return your order
 *      description: get your order
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/confirm/{id}:
 *  patch:
 *      summary: return a order confirm
 *      description: patch a order confirm
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/shipping/{id}:
 *  patch:
 *      summary: return a order shipping
 *      description: patch a order shipping
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/delivere/{id}:
 *  patch:
 *      summary: return a order delivere
 *      description: patch a order delivere
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/done/{id}:
 *  patch:
 *      summary: return a order done
 *      description: patch a order done
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

/**
 * @swagger
 * /order/cancel/{id}:
 *  delete:
 *      summary: return a order cancel
 *      description: delete a order cancel
 *      tags: [ORDER]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: ok
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 *          '400':
 *              description: bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseFail'
 */

module.exports = Route;
