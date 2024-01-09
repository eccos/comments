const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    // author: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // Reference to the parent comment
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // Self-referencing Comment schema
    deleted: { type: Boolean },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
