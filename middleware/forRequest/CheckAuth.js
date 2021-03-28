import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  let token;
  if (req.cookies) token = req.cookies.vhy;
  if (!token || token === "expiredtoken") {
    return res.status(500).json({message: "Chua dang nhap"})
  }
  const decodedToken = jwt.verify(token, process.env.EXAMPLE_TOKEN);

  req.account = { accountId: decodedToken.accountId };
  req.permission = { role: decodedToken.role };
  next();
};

export default checkAuth;