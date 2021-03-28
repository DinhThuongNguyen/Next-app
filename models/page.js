const mongoose = require("mongoose");
const {Schema} = mongoose;

const nhanBaiViet = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
})

module.exports =  mongoose.models.pages || mongoose.model("pages", nhanBaiViet);