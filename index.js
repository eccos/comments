const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');

const commentRouter = require('./routes/commentRouter');

const mongoose = require('mongoose');

const hostname = 'localhost';
const serverPort = 3000;
const serverUrl = `http://${hostname}:${serverPort}/`;
const dbPort = 27017;
const db = 'commentsApp';
const dbUrl = `mongodb://${hostname}:${dbPort}/${db}`;

const connect = mongoose.connect(dbUrl);

connect.then(
  () => console.log(`Database running at ${dbUrl}`),
  (err) => console.log(err)
);

const app = express();

app.use(logger('dev'));
app.use(express.json());
// allows access to /public folder if path and file ext are known
// removed b/c i want routers to handle it
// app.use(express.static(__dirname + '/public'));

app.use('/comments', commentRouter);

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('This is an Express Server');
});

// catch-all error handler
app.use((err, req, res, next) => {
  return next(createError(500, err));
});

app.listen(serverPort, hostname, () => {
  console.log(`Server running at ${serverUrl}`);
});

exports.myExpressApp = app;
