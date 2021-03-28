import dbConnect from "../../../util/dbConnect";
import dbBlog from "../../../models/blogData";
import dbTag from "../../../models/nhanBaiViet";

dbConnect();
const listNew = async (req, res) =>{
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "chi duoc dung get"});
  }

  try {
    const arrId = [];
    const blog = await dbBlog.find();
    // const dataBlog = 
    blog.reverse().slice(0, 3).map( item => {
      // const idBlog = item._id;
      // return idBlog;
      arrId.push(item._id)
    });

    const arrTag = await dbTag.find().sort({"sobaiviet": -1});

    return res.status(200).json({arr:arrId, arrTag: arrTag.slice(0, 3)});
  } catch (error) {
    return res.status(404).json({message: "error get news"})
  }
}
export default listNew;