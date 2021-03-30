import { check, validationResult } from "express-validator";
import initMiddleware from "../../../middleware/forBody/initMiddleware";
import validateMiddleware from "../../../middleware/forBody/validateMiddleware";
import dbAccount from "../../../models/account";
import dbConnect from "../../../util/dbConnect";
import mongoose from "mongoose";
import dbPOST from "../../../models/blogData";
import dbTag from "../../../models/nhanBaiViet";
import nc from "next-connect";
import CheckAuth from "../../../middleware/forRequest/CheckAuth";
import CheckAdmin from "../../../middleware/forRequest/CheckAdmin";

const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("title").isLength({ min: 6 }),
      check("description").isLength({ min: 6 }),
      check("content").isLength({ min: 6 }),
      check("tag").isLength({ min: 5 }),
      check("images").isArray({ min: 0 }),
      check("date").isLength({ min: 5 }),
    ],
    validationResult
  )
);
dbConnect();

const postBlog = nc();
postBlog
  .use(CheckAuth)
  .use(CheckAdmin)
  .post(async (req, res) => {

    await validateBody(req, res); 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { title, description, content, tag, images, date } = req.body;

    try {
      const post = await new dbPOST({
        title,
        description,
        content,
        tag: tag
          .normalize("NFC")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D"),
        images,
        date,
        creator: req.account.accountId,
        luotxem: 0,
      });

      let valueAccount;
      try {
        valueAccount = await dbAccount.findById(req.account.accountId);
      } catch (error) {
        return res.status(404).json({ message: "Cannot create new posts" });
      }
      if (!valueAccount) {
        return res.status(405).json({ message: "No data account" });
      }

      let sess;
      try {
        sess = await mongoose.startSession();
        sess.startTransaction();
        await post.save({ session: sess });
        await valueAccount.posts.push(post);
        await valueAccount.save({ session: sess });
        await sess.commitTransaction();
      } catch (error) {
        return res
          .status(405)
          .json({ message: "Không thể tạo bài mới, đã xảy ra lỗi" });
      }

      dbTag.findOne({ tag: tag }, async (err, item) => {
        if (err) {
          return res.status(404).json({ message: "loi tag" });
        }
        try {
          if (!item) {
            const arr = [];
            arr.push(post.id);
            const newTag = await new dbTag({
              tag: tag
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D"),
              sobaiviet: 1,
              idTag: arr,
            });
            await newTag.save();
          } else {
            let total = item.sobaiviet;
            total += 1;
            await item.idTag.push(post.id);
            item.sobaiviet = await total;
            await item.save();
          }
        } catch (error) {
          console.log(error);
          return res.status(404).json({ message: "loi tag err" });
        }
      });

      return res.status(200).json({ contents: post.toObject() });
    } catch (error) {
      return res.status(405).json({ message: "Can not post data, try again" });
    }
  });

export default postBlog;
