const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./routes/router');


// App Setup
app.use(morgan('combined')); // logging incoming request
app.use(bodyParser.json({type: '*/*'})) // parse incoming request no matter what the type is
router(app);

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on: ${port}`)


