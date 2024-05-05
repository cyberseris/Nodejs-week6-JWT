const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    userName: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, '貼文姓名未填寫']
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }, {
  versionKey: false,
  strictPopulate: false
}
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;