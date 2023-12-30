const express = require('express');
const commentRouter = express.Router();
const path = require('path');

commentRouter
  .route('/')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
  })
  .get((req, res) => {
    const filePath = path.join(__dirname, '../public/comment.html');
    res.sendFile(filePath);
  })
  .post((req, res) => {
    res.end(
      `Will add comment "${req.body.name}" with description "${req.body.description}"`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /comment');
  })
  .delete((req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /comment');
  });

commentRouter
  .route('/:commentId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
  })
  .get((req, res) => {
    res.end(`Will send details of comment "${req.params.commentId}" to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`Will POST reply to /comment/${req.params.commentId}`);
  })
  .put((req, res) => {
    res.write(`Updating comment "${req.params.commentId}"\n`);
    res.end(`Will update comment "${req.body.name}"
    with description "${req.body.description}"`);
  })
  .delete((req, res) => {
    res.end(`Deleting comment "${req.params.commentId}"`);
  });

module.exports = commentRouter;
