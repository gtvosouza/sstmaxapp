require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const  swaggerDocument  = require('./swaggerDocument');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocument));

require('./app/controllers/index')(app);

console.log(process.env.PORT);

app.listen(process.env.PORT || 3334);