import dbPOST from "../../../models/blogData";
import mongoose from "mongoose";
import dbTag from "../../../models/nhanBaiViet";
import dbConnect from "../../../util/dbConnect";
import nc from "next-connect";
import CheckAuth from "../../../middleware/forRequest/CheckAuth";
import CheckAdmin from "../../../middleware/forRequest/CheckAdmin";

dbConnect();
const deleted = nc();

deleted
  .use(CheckAuth)
  .use(CheckAdmin)
  .delete(async (req, res) => {
    const { idDelete, nhan } = req.body;
    if (!idDelete) {
      return res.status(404).json({ message: "Error delete" });
    }

    dbTag.findOne({ tag: nhan }, async (err, item) => {
      if (err) return res.status(404).json({ message: "loi xoa tag err" });
      if (!item) return res.status(404).json({ message: "loi xoa tag item" });
      const arr = item.idTag;
      const idx = arr.findIndex((item) => item === idDelete);
      await arr.splice(idx, 1);
      item.idTag = arr;
      item.sobaiviet -= 1;
      item.save();
    });

    let blog;
    try {
      blog = await dbPOST.findById(idDelete).populate("creator");
    } catch (error) {
      return res.status(404).json({ message: "Không có bài viết" });
    }
    if (!blog || blog.creator.id !== req.account.accountId) {
      return res.status(405).json({ message: "Không thể xóa bài viết" });
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await blog.remove({ session: sess });
      await blog.creator.posts.pull(blog);
      await blog.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return res
        .status(405)
        .json({ message: "Something went wrong, could not delete place." });
    }

    const idBlog = req.account.accountId;
    const kq = await dbPOST.find({ creator: idBlog });
    res
      .status(200)
      .json({ result: kq.map((item) => item.toObject({ getters: true })) });
  });

export default deleted;