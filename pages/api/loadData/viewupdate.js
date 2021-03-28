import dbBlog from "../../../models/blogData";
import dbConnect from "../../../util/dbConnect";

dbConnect();

const viewupdate = async (req, res) => {
  const {method} = req;
  if(method !== "PATCH"){
    return res.status(500).json({message: "Chỉ được dùng phương thức patch"});
  }
  const {idBlog} = req.body;
  console.log(idBlog);
  if(!idBlog){
    return res.staus(404).json({message: "Khong co id"});
  }
  try {
    const blog = await dbBlog.findById(idBlog);
    if(!blog){
      return res.status(404).json({message: "id kong hop le"})
    } else {
      blog.luotxem = await blog.luotxem + 1 ;
      await blog.save();
      res.send("ok")
    }
  } catch (error) {
    return res.status(405).json({message: "loi lay du lieu"}); 
  }
}

export default viewupdate;