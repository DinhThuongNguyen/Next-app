import dbConnect from "../../../util/dbConnect";
import dbTag from "../../../models/nhanBaiViet";

dbConnect()
const getTag = async (req, res) =>{
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "phương thức ko khả dụng"})
  }
  try {
    const arr = [];
    const tag = await dbTag.find().sort({ sobaiviet: -1 });
    tag.map((item) => {
      arr.push(item.tag);
    });
    return res.status(200).json({result: arr});
  } catch (error) {
    return res.status(404).json({message: "Da xay ra loi"})
  }
}
export default getTag;