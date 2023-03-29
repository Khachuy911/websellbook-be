const express = require('express');
const Route = express.Router();

const UserController = require('../controller/userController');
const Auth = require('../middleware/authMiddleware');
const AsyncHandle = require('../middleware/asyncHandle');
const { DEFAULT_VALUE } = require('../helper/constant');

Route.delete('/deletesoft/:id', Auth.checkToken, Auth.permission('/user/deletesoft/:id', DEFAULT_VALUE.READ, DEFAULT_VALUE.DELETE), AsyncHandle(UserController.deleteSoft));
Route.get('/getme', Auth.checkToken, AsyncHandle(UserController.getMe));

Route.route('/:id')
    .delete(Auth.checkToken, Auth.permission('/user/:id/', DEFAULT_VALUE.READ, DEFAULT_VALUE.DELETE), AsyncHandle(UserController.deleteHard))

Route.route('/')
    .patch(Auth.checkToken, AsyncHandle(UserController.updateUser))
    .get(Auth.checkToken, Auth.permission('/user/', DEFAULT_VALUE.READ), AsyncHandle(UserController.getUser));



/**
 * @swagger
 * tags:
 *  name: USER
 *  description: API OF USER
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http 
 *          scheme: bearer
 *          bearerFormat: JWT    
 */

/**
 * @swagger
 *  components:
 *      schemas:    
 *          User:
 *              type: object
 *              properties:     
 *                  username: 
 *                      type: string
 *                  email: 
 *                      type: string
 *                  password: 
 *                      type: string
 *                  age:
 *                      type: integer
 *                  address: 
 *                      type: string
 *                  phone:
 *                      type: string
 *                  
 */

/**
 * @swagger
 * /user/:
 *  get:
 *      summary: return list of the user
 *      description: get all user 
 *      tags: [USER]
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
 * /user/getme:
 *  get:
 *      summary: return a user
 *      description: get a user by id
 *      tags: [USER]
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
 * /user/{id}:
 *  delete:
 *      summary: delete hard user
 *      description: delete a user by id
 *      tags: [USER]
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: id of user
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
 * /user/deletesoft/{id}:
 *  delete:
 *      summary: delete soft user
 *      description: delete soft a user by id
 *      tags: [USER]
 *      security: 
 *        - bearerAuth: []
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of user
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update user successful
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
 * /user/{id}:
 *  patch:
 *      summary: update a user
 *      description: update a user by id
 *      tags: [USER]
 *      security: 
 *        - bearerAuth: []
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *                      
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of user
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update user successful
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