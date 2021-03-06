import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import initMiddleware from "../../../middleware/forBody/initMiddleware";
import validateMiddleware from "../../../middleware/forBody/validateMiddleware";
import dbConnect from "../../../util/dbConnect";
import DBaccount from "../../../models/account";
import cookie from "cookie";

dbConnect();
const validateBody = initMiddleware(
  validateMiddleware(
    [
      check("dataCheck").not().isEmpty(),
      check("password").not().isEmpty().trim(),
    ],
    validationResult
  )
);
const JWT_EXPIRATION_NUM = 14 * 1000 * 60 * 60 * 8;

const UpdatePassword = async (req, res) => {
  const { method } = req;
  if (method !== "PATCH") {
    return res.status(500).json({ message: "Request HTTP Method Incorrect." });
  }

  await validateBody(req, res);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { dataCheck, password } = req.body;

  let checkAccount = (await DBaccount.findOne({ email: dataCheck }).exec())
    ? await DBaccount.findOne({ email: dataCheck }).exec()
    : await DBaccount.findOne({ name: dataCheck }).exec();
  const salt = await bcrypt.genSalt(10);
  let hashPassword = await bcrypt.hash(password, salt);
  checkAccount.password = hashPassword;
  await checkAccount.save();

  let token;
  try {
    token = jwt.sign(
      {
        accountId: checkAccount.id,
        role: checkAccount.role,
      },
      process.env.EXAMPLE_TOKEN,
      { expiresIn: "8h" }
    );
  } catch (error) {
    return res.status(405).json({ message: "Create token failed" });
  }
  const options = {
    expires: new Date(Date.now() + JWT_EXPIRATION_NUM),
    secure: process.env.NODE_ENV === "production",
    httpOnly: process.env.NODE_ENV !== "production",
    sameSite: "lax",
    path: "/",
  };
  try {
    res.setHeader("Set-Cookie", cookie.serialize("vhy", token, options));
  } catch (error) {
    return res.status(405).json({ message: "Error set cookie" });
  }

  res.status(200).json({
    name: checkAccount.name,
    role: checkAccount.role,
    avatar: checkAccount.avatar,
    accountId: checkAccount.id,
  });
};

export default UpdatePassword;
