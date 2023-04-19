const express = require("express");
const Route = express.Router();

const ProductController = require("../controller/productController");
const Auth = require("../middleware/authMiddleware");
const AsyncHandle = require("../middleware/asyncHandle");
const upload = require("../middleware/multer");
const { DEFAULT_VALUE } = require("../helper/constant");

Route.get("/create",(req,res,next)=>{
  res.render("../view/admin/CreateProduct")
})


Route.delete(
  "/deletesoft/",
  Auth.checkToken,
  Auth.permission(
    "/product/deletesoft/",
    DEFAULT_VALUE.DELETE,
    DEFAULT_VALUE.READ
  ),
  AsyncHandle(ProductController.deleteSoft)
);

Route.route("/productBycategory").get(
  AsyncHandle(ProductController.getProductByCategory)
);

Route.route("/search").get(AsyncHandle(ProductController.searchProduct));

Route.route("/:id")
  .patch(
    Auth.checkToken,
    Auth.permission(
      "/product/:id/",
      DEFAULT_VALUE.EDIT,
      DEFAULT_VALUE.READ,
      DEFAULT_VALUE.DELETE
    ),
    upload.any(),
    AsyncHandle(ProductController.update)
  )
  .get(AsyncHandle(ProductController.getDetail));

Route.route("/")
  .get(Auth.checkLogin,AsyncHandle(ProductController.getProduct))
  .post(
    Auth.checkToken,
    Auth.permission("/product/", DEFAULT_VALUE.ADD, DEFAULT_VALUE.READ),
    upload.any(),
    AsyncHandle(ProductController.create)
  )
  .delete(
    Auth.checkToken,
    Auth.permission("/product/", DEFAULT_VALUE.DELETE, DEFAULT_VALUE.READ),
    AsyncHandle(ProductController.deleteHard)
  );

/**
 * @swagger
 * tags:
 *  name: PRODUCT
 *  description: API OF PRODUCT
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Product:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  barCode:
 *                      type: string
 *                  priceImport:
 *                      type: double
 *                  priceSelling:
 *                      type: double
 *                  weight:
 *                      type: integer
 *                  quantity:
 *                      type: integer
 *                  description:
 *                      type: string
 *                  image:
 *                      type: array
 *                      items:
 *                          type: file
 *                          fomart: binary
 *                  categoryId:
 *                      type: string
 *
 */

/**
 * @swagger
 * /product/:
 *  post:
 *      summary: create a new product
 *      description: post a new product
 *      tags: [PRODUCT]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
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
 * /product/:
 *  get:
 *      summary: return list of the product
 *      description: get all product
 *      tags: [PRODUCT]
 *      parameters:
 *        - in: query
 *          name: search
 *        - in: query
 *          name: category
 *        - in: query
 *          name: page
 *        - in: query
 *          name: title
 *        - in: query
 *          name: type
 *      responses:
 *          '200':
 *              description: ok
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
 * /product/{id}:
 *  get:
 *      summary: return a product
 *      description: get a product by id
 *      tags: [PRODUCT]
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
 * /product/deletesoft/:
 *  delete:
 *      summary: delete soft product
 *      description: delete soft a product by ids
 *      tags: [PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          ids:
 *                              type: string
 *      responses:
 *          '200':
 *              description: update product successful
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
 * /product/:
 *  delete:
 *      summary: delete hard product
 *      description: delete a product by ids
 *      tags: [PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          ids:
 *                              type: string
 *      responses:
 *          '204':
 *              description: delete success
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
 *
 */

/**
 * @swagger
 * /product/{id}:
 *  patch:
 *      summary: update a product
 *      description: update a product by id
 *      tags: [PRODUCT]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      parameters:
 *        - in: path
 *          name: id
 *          description: id of product
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update product successful
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResponseSuccess'
 */

module.exports = Route;
