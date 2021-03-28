const mongoose = require("mongoose");
const {Schema} = mongoose;

const Newpost = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  content: {type: String, required: true},
  tag: {type: String, required: true},
  images: [{type: Object, required: true}],
  date: {type: String, required: true},
  creator: {type: mongoose.Types.ObjectId, required: true, ref: "accounts"},
  luotxem: {type: Number, required: true}
})

module.exports =  mongoose.models.posts || mongoose.model("posts", Newpost);