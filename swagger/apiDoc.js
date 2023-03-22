const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const option = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API FOR PROJECT AT VMO',
            description: 'API',
            version: '1.0.0'
        },
        servers: [{
            url: 'http://localhost:3000'
        }]
    },
    apis: [
        path.join(__dirname, '../src/router/userRouter.js'),
        path.join(__dirname, '../src/router/categoryRouter.js'),
        path.join(__dirname, '../src/router/flashSaleRouter.js'),
        path.join(__dirname, '../src/router/productRouter.js'),
        path.join(__dirname, '../src/router/voucherRouter.js'),
        path.join(__dirname, '../src/router/orderRouter.js'),
        path.join(__dirname, '../src/router/authRouter.js'),
        path.join(__dirname, '../src/router/commentRouter.js')
    ]
}
const swaggerSpec = swaggerJsDoc(option);

module.exports = swaggerSpec;