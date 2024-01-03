const express = require('express');
const commentRouter = express.Router();
const path = require('path');
const fs = require('fs');

const commentView = 'comment.html';
const commentsDataFile = 'comments.json';

commentRouter
  .route('/')
  .get((req, res) => {
    const filePath = path.join(__dirname, `../public/${commentView}`);
    res.sendFile(filePath);
  })
  .post((req, res, next) => {
    // verify req json is in correct format {"comment": string}
    if (!req.body.comment) throw 'Error: Malformed JSON. Missing key: comment';
    if (typeof req.body.comment !== 'string')
      throw 'Error: Malformed JSON. comment value is not of type String';

    fs.readFile(commentsDataFile, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // file doesn't exist, create it and add first comment
          createComment();
        } else {
          return next(err); // other file read errors
        }
      } else {
        // file exists, parse data and add new comment
        try {
          const comments = JSON.parse(data);
          const newId = 1 + comments.length;
          createComment(newId, comments);
        } catch (error) {
          return next(error); // error parsing existing comments
        }
      }
    });

    function createComment(id = 1, comments) {
      const comment = String(req.body.comment);
      const newComment = { id, comment };
      const data = comments ? [...comments, newComment] : [newComment];
      fs.writeFile(commentsDataFile, JSON.stringify(data), (err) => {
        if (err) return next(err);
        res.status(201).send('Comment created successfully!');
      });
    }
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /comment');
  })
  .delete((req, res) => {
    res.statusCode = 403;
    res.send('DELETE operation not supported on /comment');
  });

commentRouter
  .route('/:id')
  .all((req, res, next) => {
    fs.readFile(commentsDataFile, (err, data) => {
      if (err) return next(err);
      const comments = JSON.parse(data);
      const comment = comments.find((c) => c.id === req.params.id);
    });
    next();
  })
  .get((req, res) => {
    // TODO: verify file & comment id exist before returning comment as json
    res.send(comment);
  })
  .post((req, res) => {
    // TODO: verify original comment exists before linking reply to it
    const json = req.body;
    const data = JSON.stringify(json);
    res.send(`Will POST reply ${data} to comment "${req.params.id}"`);
  })
  .put((req, res) => {
    // TODO: verify comment exists before update attempt
    const json = req.body;
    const data = JSON.stringify(json);
    res.send(
      `Will PUT new comment edit ${data} to original comment "${req.params.id}"\n`
    );
  })
  .delete((req, res) => {
    // TODO: verify comment exists before delete
    res.send(`Will DELETE comment "${req.params.id}"`);
  });

module.exports = commentRouter;
