import dbConnect from "../../../util/dbConnect";
import dbTag from "../../../models/nhanBaiViet";
import dbBlog from "../../../models/blogData";


dbConnect()
const newsFeed = async (req, res) =>{
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "chi duoc dung get"});
  }

  try {
    const arrTag = [];
    const tags = await dbTag.find();
    tags.map((item) => arrTag.push(item.tag));
    const blog = await dbBlog.find();
    const arr = [];
    const arrId = [];
    let flagTag = "";
    const bl = blog.reverse();
    const obj = {
      tag: "",
      idTag: "",
    };
    bl.map(async (item, idx) => {
      if (idx <= 2) {
        obj.tag = item.tag;
        obj.idTag = item.id;
        const a = { ...obj };
        arr.push(a);
      }
    });
    flagTag = arr[0].tag;
    for (let i of arr) {
      if (i.tag !== flagTag) {
        arrId.push(i.id);
      }
    }
    return res.status(200).json({ arr: arr });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Da xay ra loi" });
  }
}
export default newsFeed;