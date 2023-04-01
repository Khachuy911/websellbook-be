const express = require('express');
const Route = express.Router();

const VoucherController = require('../controller/voucherController');
const AsyncHandle = require('../middleware/asyncHandle');
const Auth = require('../middleware/authMiddleware');
const { DEFAULT_VALUE } = require('../helper/constant');

Route.delete('/deletesoft/:id', Auth.checkToken, Auth.permission('/voucher/deletesoft/:id/', DEFAULT_VALUE.READ, DEFAULT_VALUE.DELETE, DEFAULT_VALUE.EDIT), AsyncHandle(VoucherController.deleteSoft))

Route.route('/:id')
  .patch( AsyncHandle(VoucherController.update))
  .get(Auth.checkToken, Auth.permission('/voucher/:id/', DEFAULT_VALUE.READ), AsyncHandle(VoucherController.getDetail))
  .delete(Auth.checkToken, Auth.permission('/voucher/:id/', DEFAULT_VALUE.READ, DEFAULT_VALUE.DELETE), AsyncHandle(VoucherController.deleteHard))

Route.route('/')
  .post(AsyncHandle(VoucherController.create))
  .get(Auth.checkToken, AsyncHandle(VoucherController.getVoucher))

/**
 * @swagger
 * tags:
 *  name: VOUCHER
 *  description: API OF VOUCHER
 */

/**
 * @swagger
 *  components:
 *      schemas:    
 *          Voucher:
 *              type: object
 *              properties:     
 *                  name: 
 *                      type: string
 *                  discountAmount: 
 *                      type: string
 *                  expireDate: 
 *                      type: string    
 *                  quantity: 
 *                      type: integer
 */

/**
 * @swagger
 * /voucher/:
 *  post:
 *      summary: create a new voucher
 *      description: post a new voucher
 *      tags: [VOUCHER]
 *      security: 
 *          - bearerAuth: []
 *      requestBody: 
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Voucher'
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
 * /voucher/:
 *  get:
 *      summary: return list of the voucher
 *      description: get all voucher 
 *      tags: [VOUCHER]
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
 * /voucher/{id}:
 *  get:
 *      summary: return a voucher
 *      description: get a voucher by id
 *      tags: [VOUCHER]
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
 * /voucher/deletesoft/{id}:
 *  delete:
 *      summary: delete soft flash sale
 *      description: delete soft a voucher by id
 *      tags: [VOUCHER]
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of voucher
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update voucher successful
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
 * /voucher/{id}:
 *  delete:
 *      summary: delete hard voucher
 *      description: delete a voucher by id
 *      tags: [VOUCHER]
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of voucher
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
 * /voucher/{id}:
 *  patch:
 *      summary: update a voucher
 *      description: update a voucher by id
 *      tags: [VOUCHER]
 *      security: 
 *        - bearerAuth: []
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Voucher'
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of voucher
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