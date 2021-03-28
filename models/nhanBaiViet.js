const mongoose = require("mongoose");
const {Schema} = mongoose;

const nhanBaiViet = new Schema({
  tag: {type: String, required: true},
  sobaiviet: {type: Number, required: true},
  idTag: [{type: Object, required: true}]
})

module.exports =  mongoose.models.NhanBaiViet || mongoose.model("NhanBaiViet", nhanBaiViet);