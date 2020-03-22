const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', require('./router/index'));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(5000, () => {
    console.log('Run at port 5000')
    console.log('[Swagger] http://localhost:5000/')
})