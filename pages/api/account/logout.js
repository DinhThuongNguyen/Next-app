import cookie from "cookie";

const logout = (req, res) => {
  req.session = null;
  const options = {
    maxAge: -1,
    path: '/',
  };
  try {
    res.setHeader("Set-Cookie", cookie.serialize("vhy", " ", options));
  } catch (error) {
    return res.status(405).json({ message: "Error set cookie" });
  }
  res.redirect("/login");
}

export default logout;