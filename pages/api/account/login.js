import { check, validationResult } from "express-validator";
import initMiddleware from "../../../middleware/forBody/initMiddleware";
import validateMiddleware from "../../../middleware/forBody/validateMiddleware";
import DBaccount from "../../../models/account";
import dbConnect from "../../../util/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import nc from "next-connect";
import cors from "cors";

dbConnect();
const validateBody = initMiddleware(
  validateMiddleware(
    [check("email").not().isEmpty(), check("password").not().isEmpty()],
    validationResult
  )
);
const JWT_EXPIRATION_NUM = 14 * 1000 * 60 * 60 * 8;

const login = nc();
login.use(cors()).post(async (req, res) => {
  await validateBody(req, res);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const checkEmail = await DBaccount.findOne({ email: email }).exec();
  const check_tenDangNhap = await DBaccount.findOne({ name: email }).exec();
  if (!checkEmail && !check_tenDangNhap) {
    return res.status(404).json({ message: "Tài khoản này không tồn tại" });
  }
  const result = checkEmail ? checkEmail : check_tenDangNhap;
  const checkPassword = await bcrypt.compare(password, result.password);

  if (!checkPassword) {
    return res.status(404).json({ message: "sai mật khẩu" });
  }

  let token;
  try {
    token = jwt.sign(
      {
        accountId: result.id,
        role: result.role,
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
    name: result.name,
    role: result.role,
    avatar: result.avatar,
    accountId: result.id,
  });
});

export default login;