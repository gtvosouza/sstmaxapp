require('dotenv/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('OK');
})

require('./app/controllers/index')(app);

console.log(process.env.PORT);

app.listen(process.env.PORT || 666);