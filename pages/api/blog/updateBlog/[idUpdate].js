import dbPOST from "../../../../models/blogData";
import dbTag from "../../../../models/nhanBaiViet";
import dbConnect from "../../../../util/dbConnect";
import nc from "next-connect";
import CheckAuth from "../../../../middleware/forRequest/CheckAuth";
import CheckAdmin from "../../../../middleware/forRequest/CheckAdmin";

dbConnect();
const updateBlog = nc();

updateBlog
  .use(CheckAuth)
  .use(CheckAdmin)
  .patch(async (req, res) => {

    const id = req.query.idUpdate;
    const { title, description, content, tag } = req.body;
    if (!id) {
      return res.status(405).json({ message: "Khong tim thay id" });
    }

    let dataBlog;

    try {
      dataBlog = await dbPOST.findById(id);
    } catch (error) {
      return res.status(405).json({ message: "error data" });
    }

    if (!dataBlog) {
      return res.status(404).json({ message: "Khong tim thay bai post" });
    }

    dbTag.findOne({ tag: tag }, async (err, item) => {
      if (err) {
        return res.status(404).json({ message: "loi tag" });
      }
      try {
        if (!item) {
          const arr = [];
          arr.push(dataBlog.id);
          const newTag = await new dbTag({
            tag: tag,
            sobaiviet: 1,
            idTag: arr,
          });
          await newTag.save();
        } else if (dataBlog.tag !== tag) {
          let total = item.sobaiviet;
          total += 1;
          await item.idTag.push(dataBlog.id);
          item.sobaiviet = await total;
          await item.save();
        } else {
          let total = item.sobaiviet;
          total += 1;
          await item.idTag.push(dataBlog.id);
          item.sobaiviet = await total;
          await item.save();
        }
      } catch (error) {
        return res.status(404).json({ message: "loi tag err" });
      }
    });

    try {
      dataBlog.title = title;
      dataBlog.description = description;
      dataBlog.content = content;
      dataBlog.tag = tag;

      await dataBlog.save();
    } catch (error) {
      return res.status(500).json({ message: "khong the update" });
    }

    res.status(200).json({ result: dataBlog.toObject({ getters: true }) });
  });

export default updateBlog;