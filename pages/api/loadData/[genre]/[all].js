import dbTag from "../../../../models/nhanBaiViet";
import dbConnect from "../../../../util/dbConnect";

dbConnect();
const getGenre = async (req, res) => {
  const {method} = req;
  if(method !== "GET"){
    return res.status(500).json({message: "Chỉ chấp nhận phương thức get"})
  }
  
  const {page, limit, genre} = req.query;
  if(typeof parseInt(page) !== "number" || typeof parseInt(limit) !== "number"){
    return res.status(404).json({message: "sai du lieu dau vao"});
  }
  try {
    await dbTag.findOne({tag: genre},async (err, item) => {
      err && res.status(404).json({message: "loi get tag"});
      if(!item){ 
        return res.status(404).json({message: "tag khong hop le"})
      };
      const arrTag = await item.idTag.reverse();
      return res.status(200).json({arrTag: arrTag.slice(parseInt(limit) * (parseInt(page) - 1), (parseInt(page) * parseInt(limit)))});
    });
  
  } catch (error) {
    return res.status(405).json({message: "da bi loi"})
  }
}

export default getGenre;