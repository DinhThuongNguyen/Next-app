const mongoose = require('mongoose');
const {Schema} = mongoose;

const signUp_schema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  avatar: {type: String, required: true},
  role: {type: String,default: "user" ,required: true},
  phone: {type: String, required: true},
  genre: {type: String, required: true},
  posts: [{type: mongoose.Types.ObjectId, required: true, ref: "posts"}],
})
module.exports = mongoose.models.accounts || mongoose.model("accounts", signUp_schema);