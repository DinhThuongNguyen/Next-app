import DBaccount from "../../../models/account";
import dbConnect from "../../../util/dbConnect";

dbConnect();

const getAccount = ( req, res) => {
  DBaccount.findById(req.query.id).exec((err, account) => {
    if (err) {
      // return next(new httpError("Can't find account", 404));
      return res.status(404).json({error: "id wrong"})
    } else {
      if(!account){
        return res.status(404).json({error: "account not found"});
      }
      return res.status(200).json({
        id: account._id,
        name: account.name,
        avatar: account.avatar,
        role: account.role,
      });
    }
  });
}

export default getAccount;