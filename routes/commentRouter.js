const express = require('express');
const commentRouter = express.Router();
const path = require('path');
const fs = require('fs');

const commentView = 'comment.html';
const commentsDataFile = 'comments.json';

commentRouter
  .route('/')
  .get((req, res) => {
    // GET comment entry View
    const filePath = path.join(__dirname, `../public/${commentView}`);
    res.sendFile(filePath);
  })
  .post((req, res, next) => {
    // POST new comment
    // verify req json is in correct format {"text": string}
    if (!req.body.text) throw 'Error: Malformed JSON. Missing key: text';
    if (typeof req.body.text !== 'string')
      throw 'Error: Malformed JSON. text value is not of type String';

    fs.readFile(commentsDataFile, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // file doesn't exist, create it, add first comment
          createComment();
        } else {
          return next(err); // other file read errors
        }
      } else {
        // file exists, parse data, add new comment
        try {
          const comments = JSON.parse(data);
          const ids = comments.map((c) => c.id);
          const maxId = Math.max(...ids, 0);
          const newId = maxId + 1;
          createComment(newId, comments);
        } catch (error) {
          return next(error); // error parsing existing comments
        }
      }
    });

    function createComment(id = 1, comments) {
      const text = String(req.body.text);
      const newComment = { id, comment: text };
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
    // read all comments for all methods to use
    fs.readFile(commentsDataFile, (err, data) => {
      if (err) return next(err); // file read error
      try {
        const comments = JSON.parse(data);
        const comment = comments.find((c) => c.id === Number(req.params.id));
        if (!comment || comment.deleted) {
          return res.status(404).send('Comment not found');
        }
        // attach comments to request object
        req.comments = comments;
        req.comment = comment;
        next();
      } catch (error) {
        return next(error); // error parsing existing comments
      }
    });
  })
  .get((req, res) => {
    // GET requested comment
    res.send(req.comment);
  })
  .post((req, res) => {
    // TODO: link reply to original comment

    // verify req json is in correct format {"text": string}
    if (!req.body.text) throw 'Error: Malformed JSON. Missing key: text';
    if (typeof req.body.text !== 'string')
      throw 'Error: Malformed JSON. text value is not of type String';

    const data = JSON.stringify(req.body);
    res.send(`Will POST reply ${data} to comment "${req.params.id}"`);
  })
  .put((req, res) => {
    // PUT (edit/update) requested comment
    // verify req json is in correct format {"text": string}
    if (!req.body.text) throw 'Error: Malformed JSON. Missing key: text';
    if (typeof req.body.text !== 'string')
      throw 'Error: Malformed JSON. text value is not of type String';

    req.comment.text = req.body.text;

    fs.writeFile(commentsDataFile, JSON.stringify(req.comments), (err) => {
      if (err) return next(err);
      res.status(200).send('Comment updated successfully!');
    });
  })
  .delete((req, res) => {
    // DELETE requested comment
    req.comment.deleted = true;

    fs.writeFile(commentsDataFile, JSON.stringify(req.comments), (err) => {
      if (err) return next(err);
      res.status(200).send('Comment deleted successfully!');
    });
  });

module.exports = commentRouter;
