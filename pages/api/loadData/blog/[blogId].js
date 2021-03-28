const { default: dbConnect } = require("../../../../util/dbConnect");
const dbBlog = require("../../../../models/blogData");

const getDataBlog = async (req, res) => {
  await dbConnect();
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "Chỉ được dùng phương thức get"});
  }
  const {blogId} = req.query;
  if(!blogId) {
    return res.status(404).json({message: "Khong co id"})
  }
  try {
    const baiviet = await dbBlog.findById(blogId, '-creator').exec();
    if(!baiviet) {
      return res.status(404).json({message: "sai id"})
    }
    return res.status(200).json({result: baiviet})
  } catch (error) {
    return res.status(500).json({message: "da xay ra loi"})
  }
}

export default getDataBlog;