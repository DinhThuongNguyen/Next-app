import dbConnect from "../../../util/dbConnect";
import dbBlog from "../../../models/blogData";

dbConnect();
const getMostView = async (req, res) => {
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "Chỉ được dùng phương thức get"});
  }

  try {
    const arr = await dbBlog.find({}, '-creator').sort({"luotxem": -1});
    return res.status(200).json({result: arr.slice(0, 9).map(item => item.toObject({getters: true}))})
  } catch (error) {
    return res.send("err")
  }
}
export default getMostView;