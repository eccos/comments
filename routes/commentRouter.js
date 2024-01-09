const express = require('express');
const Comment = require('../models/comment');
const path = require('path');

const commentRouter = express.Router();
const commentView = 'comments.html';

commentRouter
  .route('/')
  .get((req, res, next) => {
    if (req.accepts('html')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const filePath = path.join(__dirname, `../public/${commentView}`);
      res.sendFile(filePath);
    } else if (req.accepts('json')) {
      Comment.find({
        parent: null,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
        .sort({ updatedAt: -1 })
        .limit(50)
        .then((comments) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.json(comments);
        })
        .catch((err) => next(err));
    } else {
      err = new Error('Invalid accept type');
      err.status = 406;
      next(err);
    }
  })
  .post((req, res, next) => {
    req.body.parent = null; // null = top-level comment
    Comment.create(req.body)
      .then((comment) => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(comment);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 405;
    res.json({ message: 'PUT operation not supported on /comments' });
  })
  .delete((req, res) => {
    res.statusCode = 405;
    res.json({ message: 'DELETE operation not supported on /comments' });
  });

commentRouter
  .route('/:id')
  .all((req, res, next) => {
    // find comment for all methods to use
    Comment.findById(req.params.id)
      .then((comment) => {
        // verify comment is valid and not a false positive like null or []
        if (comment) {
          if (comment.deleted) {
            return res
              .status(404)
              .json({ message: `Comment ${req.params.id} not found` });
          }
          req.comment = comment;
          next();
        } else {
          err = new Error(`Comment ${req.params.id} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .get((req, res) => {
    // TODO: if parent comment, get all replies
    // TODO: add Accept check to return view or json
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json(req.comment);
  })
  .post((req, res, next) => {
    req.body.parent = req.comment._id; // refer to top-level comment
    Comment.create(req.body)
      .then((reply) => {
        // req.comment.replies.push(reply._id); // removed replies field
        req.comment
          .save()
          .then(() => {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.json(reply);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    if (!req.body.text) {
      return res
        .status(400)
        .json({ message: 'Malformed JSON. Missing text value' });
    }
    req.comment.text = req.body.text; // update existing comment w/ new text
    req.comment
      .save()
      .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(comment);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    req.comment.deleted = true; // soft-delete
    req.comment
      .save()
      .then((comment) => {
        res.status('200').json({ message: `Deleted comment ${req.params.id}` });
      })
      .catch((err) => next(err));
  });

module.exports = commentRouter;
