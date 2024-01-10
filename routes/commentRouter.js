const express = require('express');
const path = require('path');

const commentRouter = express.Router();

const commentsView = 'comments.html';
const repliesView = 'replies.html';

commentRouter.route('/').get((req, res, next) => {
  res.statusCode = 200;
  const filePath = path.join(__dirname, `../public/${commentsView}`);
  res.sendFile(filePath);
});

commentRouter.route('/:id').get((req, res) => {
  if (req.accepts('html')) {
    res.statusCode = 200;
    const filePath = path.join(__dirname, `../public/${repliesView}`);
    res.sendFile(filePath);
  }
});

module.exports = commentRouter;
