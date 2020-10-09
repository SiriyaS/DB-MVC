const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', require('./router/index'));
// url path of swagger
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(8000, () => {
    console.log('Run at port 8000')
    console.log('[Swagger] http://localhost:8000/')
})