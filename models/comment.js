const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // Reference to the parent comment
    // author: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    text: { type: String, required: true },
    deleted: { type: Boolean },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
