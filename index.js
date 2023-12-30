const express = require('express');
const morgan = require('morgan');
const commentRouter = require('./routes/commentRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.static(__dirname + '/public'));
app.use('/comment', commentRouter);

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('This is an Express Server');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

exports.myExpressApp = app;
