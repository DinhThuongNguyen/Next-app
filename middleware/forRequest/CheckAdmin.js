const checkAdmin = async (req, res, next) => {
  try {
    const role = req.permission.role;
    if (!role || role === "user") {
      return res.status(500).json({message: "Not admin"});
    } else {
      next();
    }
  } catch (error) {
    return res.status(500).json({message: "Server issue !"})
  }
};

export default checkAdmin;
