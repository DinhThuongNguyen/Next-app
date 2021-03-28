import dbPOST from "../../../models/blogData";
import dbConnect from "../../../util/dbConnect";
import nc from "next-connect";
import CheckAuth from "../../../middleware/forRequest/CheckAuth";
import CheckAdmin from "../../../middleware/forRequest/CheckAdmin";

dbConnect();
const getData = nc();

getData
  .use(CheckAuth)
  .use(CheckAdmin)
  .get(async (req, res) => {
    const idAccount = req.account.accountId;
    if (!idAccount) {
      return res.status(405).json({ message: "Không có id account" });
    }

    let dataBlog;
    try {
      dataBlog = await dbPOST.find({ creator: idAccount });
      const tempData = await dataBlog.reverse();
      return res
        .status(200)
        .json({
          result: tempData.map((item) => item.toObject({ getters: true })),
        });
    } catch (error) {
      return res.status(405).json({ message: "Loi khong tim thay account" });
    }
  });
export default getData;