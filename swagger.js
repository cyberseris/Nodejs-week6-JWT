const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Nodejs-week6-JWT',
    description: 'JWT 身份驗證機制'
  },
  host: 'localhost:3005'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);