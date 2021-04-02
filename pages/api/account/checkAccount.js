import DBaccount from "../../../models/account";

export default async function checkAccount(req, res) {
  const { method } = req;
  if (method !== "POST") {
    return res.status(422).json({ message: "Request HTTP Method Incorrect." });
  }
  const { dataCheck } = req.body;
  const check = (await DBaccount.findOne({ email: dataCheck }).exec())
    ? await DBaccount.findOne({ email: dataCheck }).exec()
    : await DBaccount.findOne({ name: dataCheck }).exec();
  if (check) {
    return res.json({ message: "yes" });
  }
  return res.json({ message: "no" });
}
