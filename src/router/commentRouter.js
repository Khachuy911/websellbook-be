const express = require('express');
const Route = express.Router();

const CommentController = require('../controller/commentController');
const Auth = require('../middleware/authMiddleware');
const AsyncHandle = require('../middleware/asyncHandle');

Route.delete('/deletesoft/:id', Auth.checkToken, AsyncHandle(CommentController.deleteSoft));
Route.get('/getCommentByProduct/:id', Auth.checkToken, AsyncHandle(CommentController.getCommentByProduct))

Route.route('/:id')
  .patch(Auth.checkToken, AsyncHandle(CommentController.update))
  .get(AsyncHandle(CommentController.getDetail))

Route.route('/')
  .get(AsyncHandle(CommentController.getComment))
  .post(Auth.checkToken, AsyncHandle(CommentController.create))


/**
 * @swagger
 * tags:
 *  name: COMMENT
 *  description: API OF COMMENT
 */

/**
 * @swagger
 *  components:
 *      schemas:    
 *          Comment:
 *              type: object
 *              properties:     
 *                  text: 
 *                      type: string             
 *                  productId: 
 *                      type: string
 *                  
 */

/**
 * @swagger
 * /comment/:
 *  post:
 *      summary: create a new comment
 *      description: post a new comment
 *      tags: [COMMENT]
 *      security: 
 *          - bearerAuth: []
 *      requestBody: 
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Comment'
 *      responses:
 *          '201':
 *              description: create success
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
 * /comment/:
 *  get:
 *      summary: return list of the comment
 *      description: get all comment 
 *      tags: [COMMENT]
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
 * /comment/{id}:
 *  get:
 *      summary: return a comment
 *      description: get a comment by id
 *      tags: [COMMENT]
 *      security: 
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          description: id of comment
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
 * /comment/deletesoft/{id}:
 *  delete:
 *      summary: delete soft comment
 *      description: delete soft a comment by id
 *      tags: [COMMENT]
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
 *              description: update comment successful
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
 * /comment/{id}:
 *  patch:
 *      summary: update a comment
 *      description: update a comment by id
 *      tags: [COMMENT]
 *      security: 
 *        - bearerAuth: []
 *      requestBody:
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Comment'
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: id of comment
 *          schema:
 *              type: string
 *          required: true
 *      responses:
 *          '200':
 *              description: update comment successful
 *              content:
 *                  application/json:
 *                      schema:         
 *                          $ref: '#/components/schemas/ResponseFail'
 */

module.exports = Route;