const express = require('express');
const Route = express.Router();

const CategoryController = require('../controller/categoryController');
const AsyncHandle = require('../middleware/asyncHandle');
const Auth = require('../middleware/authMiddleware');
const Upload = require('../middleware/multer');
const { DEFAULT_VALUE } = require('../helper/constant');

Route.delete('/deletesoft/', Auth.checkToken, Auth.permission('/category/deletesoft/', DEFAULT_VALUE.DELETE, DEFAULT_VALUE.READ), CategoryController.deleteSoft);

Route.route('/:id')
    .get(Auth.checkToken, AsyncHandle(CategoryController.getDetail))
    .patch(Auth.checkToken, Auth.permission('/category/:id/', DEFAULT_VALUE.EDIT, DEFAULT_VALUE.READ, DEFAULT_VALUE.DELETE), Upload.single('image'), AsyncHandle(CategoryController.update))

Route.route('/')
    .delete(Auth.checkToken, Auth.permission('/category/', DEFAULT_VALUE.DELETE, DEFAULT_VALUE.READ), AsyncHandle(CategoryController.deleteHard))
    .post(Upload.single('image'), AsyncHandle(CategoryController.create))
    .get(
        AsyncHandle(CategoryController.getCategory))




/**
 * @swagger
 * tags:
 *  name: CATEGORY
 *  description: API OF CATEGORY
 */

/**
 * @swagger
 *  components:
 *      schemas:    
 *          Category:
 *              type: object
 *              properties:     
 *                  name: 
 *                      type: string
 *                  image: 
 *                      type: file
 *                      fomart: binary
 *                  
 */

/**
 * @swagger
 * /category/:
 *  post:
 *      summary: create a new category
 *      description: post a new category
 *      tags: [CATEGORY]
 *      security: 
 *          - bearerAuth: []
 *      requestBody: 
 *          content: 
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
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
 * /category/:
 *  get:
 *      summary: return list of the category
 *      description: get all category 
 *      tags: [CATEGORY]
 *      security: 
 *        - bearerAuth: []
 *      parameters:
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
 * /category/{id}:
 *  get:
 *      summary: return a category
 *      description: get a category by id
 *      tags: [CATEGORY]
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
 * /category/deletesoft/:
 *  delete:
 *      summary: delete soft flash sale
 *      description: delete soft a category by ids
 *      tags: [CATEGORY]
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
 *              description: update category successful
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
 * /category/:
 *  delete:
 *      summary: delete hard category
 *      description: delete a category by ids
 *      tags: [CATEGORY]
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
 * /category/{id}:
 *  patch:
 *      summary: update a category
 *      description: update a category by id
 *      tags: [CATEGORY]
 *      security: 
 *        - bearerAuth: []
 *      requestBody:
 *          content: 
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/Category'
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of category
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update category successful
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