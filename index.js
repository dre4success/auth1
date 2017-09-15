const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./routes/router');
const mongoose = require('mongoose');

//DB Setup
mongoose.connect('mongodb://localhost/auth', {
	useMongoClient: true
})

// App Setup
app.use(morgan('combined')); // logging incoming request
app.use(bodyParser.json()) // parse incoming request no matter what the type is
app.use(bodyParser.urlencoded({extended: true}))
router(app);

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on: ${port}`)


