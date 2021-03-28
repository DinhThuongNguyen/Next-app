import {check, validationResult} from "express-validator";
import dbConnect from "../../../util/dbConnect";
import DBaccount from "../../../models/account";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import initMiddleware from "../../../middleware/forBody/initMiddleware";
import validateMiddleware from "../../../middleware/forBody/validateMiddleware";
import cookie from "cookie";

dbConnect();
const validateBody = initMiddleware(
  validateMiddleware([
    check('name').isLength({min: 6, max: 30}),
    check('email').isLength({min: 8, max: 50}),
    check('password').isLength({min: 6, max: 50}),
    check('avatar').isLength({min: 6, max: 500}),
    check('phone').isLength({min: 6, max: 50}),
    check('genre').isLength({min: 1, max: 6}),
  ], validationResult)
)

const JWT_EXPIRATION_NUM = 14 * 1000 * 60 * 60 * 8;

const signup = async (req, res) => {
  const {method} = req;
  if(method !== "POST"){
    return res.status(500).json({ message: "Request HTTP Method Incorrect." });
  }

  await validateBody(req, res);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password, genre, phone, avatar } = req.body;

  const checkEmail = await DBaccount.findOne({ email: email }).exec();
  const checkName = await DBaccount.findOne({ name: name }).exec();
  if (checkEmail) {
    return res
      .status(404)
      .json({
        message: "Email này đã được đăng ký, hãy đăng ký bằng email khác",
      });
  }
  if (checkName) {
    res
      .status(404)
      .json({ message: "Tên tài khoản đã có, hãy nhập một tên khác" });
  }
  let hashPassword;
  try {
    try {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    } catch (error) {
      return res.status(405).json({ message: "hashPassword failed" });
    }
    const newAccount = await new DBaccount({
      name,
      email,
      password: hashPassword,
      avatar,
      phone,
      genre,
      post: [],
    });
    try {
      await newAccount.save();
    } catch (error) {
      return res.status(405).json({ message: "Register failed" });
    }

    let token;
  try {
    token = jwt.sign(
      {
        accountId: newAccount.id,
        role: newAccount.role,
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

    return res.status(200).json({
      name: newAccount.name,
      role: newAccount.role,
      avatar: newAccount.avatar,
      accountId: newAccount.id,
    });
  } catch (error) {
    return res.status(405).json({ message: "Create account failed" });
  }
}

export default signup;