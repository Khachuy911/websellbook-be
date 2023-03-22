const express = require('express');
const Route = express.Router();

const FlashSaleController = require('../controller/flashSaleController');
const AsyncHandle = require('../middleware/asyncHandle');
const Auth = require('../middleware/authMiddleware');
const { DEFAULT_VALUE } = require('../helper/constant');

Route.delete('/deletesoft/:id', Auth.checkToken, Auth.permission('/api/flashsale/deletesoft/:id', DEFAULT_VALUE.DELETE, DEFAULT_VALUE.READ), FlashSaleController.deleteSoft);

Route.route('/:id')
    .patch(Auth.checkToken, Auth.permission('/api/flashsale/:id/', DEFAULT_VALUE.EDIT, DEFAULT_VALUE.READ), AsyncHandle(FlashSaleController.update))
    .get(Auth.checkToken, AsyncHandle(FlashSaleController.getDetail))
    .delete(Auth.checkToken, Auth.permission('/api/flashsale/:id/', DEFAULT_VALUE.DELETE, DEFAULT_VALUE.READ), AsyncHandle(FlashSaleController.deleteHard))

Route.route('/')
    .post(Auth.checkToken, Auth.permission('/api/flashsale/', DEFAULT_VALUE.ADD, DEFAULT_VALUE.READ), AsyncHandle(FlashSaleController.create))
    .get(Auth.checkToken, AsyncHandle(FlashSaleController.getFlashSale))

/**
 * @swagger
 * tags:
 *  name: FLASHSALE
 *  description: API OF FLASHSALE
 */

/**
 * @swagger
 *  components:
 *      schemas:    
 *          FlashSale:
 *              type: object
 *              properties:     
 *                  discountAmount: 
 *                      type: integer
 *                  name: 
 *                      type: string
 *                  description: 
 *                      type: string
 *                  startDate:
 *                      type: string
 *                  endDate: 
 *                      type: string
 *                  productId: 
 *                      type: string                  
 */

/**
 * @swagger
 * /api/flashsale/:
 *  post:
 *      summary: create a new flashsale
 *      description: post a new flashsale
 *      tags: [FLASHSALE]
 *      security: 
 *          - bearerAuth: []
 *      requestBody: 
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/FlashSale'
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
 * /api/flashsale/:
 *  get:
 *      summary: return list of the flashsale
 *      description: get all flashsale 
 *      tags: [FLASHSALE]
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
 *          name: search
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
 * /api/flashsale/{id}:
 *  get:
 *      summary: return a flashsale
 *      description: get a flashsale by id
 *      tags: [FLASHSALE]
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: id of flashsale
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
 * /api/flashsale/deletesoft/{id}:
 *  delete:
 *      summary: delete soft flash sale
 *      description: delete soft a flashsale by ids
 *      tags: [FLASHSALE]
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
 *              description: update flashsale successful
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
 * /api/flashsale/{id}:
 *  delete:
 *      summary: delete hard flashsale
 *      description: delete a flashsale by id
 *      tags: [FLASHSALE]
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - in: path
 *          name: id  
 *          schema: 
 *              type: string
 *          required: true
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
 * /api/flashsale/{id}:
 *  patch:
 *      summary: update a flashsale
 *      description: update a flashsale by id
 *      tags: [FLASHSALE]
 *      security: 
 *        - bearerAuth: []
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/FlashSale'
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of flashsale
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update flashsale successful
 *              content:
 *                  application/json:
 *                      schema:         
 *                          $ref: '#/components/schemas/ResponseFail'
 */

module.exports = Route;     