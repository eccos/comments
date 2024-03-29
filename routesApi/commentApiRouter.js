const express = require('express');
const Comment = require('../models/comment');

const commentApiRouter = express.Router();

commentApiRouter
  .route('/')
  .get((req, res, next) => {
    Comment.find({
      parent: null, // null = top-level comment
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    })
      .sort({ updatedAt: -1 })
      .limit(50)
      .then((comments) => {
        res.statusCode = 200;
        res.json(comments);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Comment.create({
      parent: null, // null = top-level comment
      text: req.body.text,
    })
      .then((comment) => {
        res.statusCode = 201;
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

commentApiRouter
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
    Comment.find({
      parent: req.params.id,
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    })
      .then((replies) => {
        res.statusCode = 200;
        res.json([req.comment, ...replies]);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Comment.create({
      parent: req.comment._id, // refer to top-level comment
      text: req.body.text,
    })
      .then((reply) => {
        // req.comment.replies.push(reply._id); // removed replies field
        req.comment
          .save()
          .then(() => {
            res.statusCode = 201;
            res.json(reply);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    if (req.body.text) {
      req.comment.text = req.body.text; // update existing comment w/ new text
      req.comment
        .save()
        .then((comment) => {
          res.statusCode = 200;
          res.json(comment);
        })
        .catch((err) => next(err));
    } else {
      err = new Error('Malformed JSON. Missing text value');
      err.status = 400;
      return next(err);
    }
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

module.exports = commentApiRouter;
