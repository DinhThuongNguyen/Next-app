const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const nc = require("next-connect");
import formidable from "formidable";

const TYPE_IMAGE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

  const fileUpLoad = multer({
  limits: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // cb(null, `../Images/`);
      cb(null, false);
    },
    filename: (req, file, cb) => {
      const temp = TYPE_IMAGE[file.mimetype];
      cb(null, uuidv4() + "." + temp);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!TYPE_IMAGE[file.mimetype];
    let error = isValid ? null : new Error("Invalid type image");
    cb(error, isValid);
  },
});


const imageUpload = nc();
imageUpload.use(fileUpLoad.single("image")).post(async (req, res) => {
  const {method} = req;
  if(method !== "POST"){
    return res.status(404).json({ message: "Request HTTP Method Incorrect." });
  }
  try {
    if(!req.file){
      return res.status(404).json({message : "khong co file anh"})
    }
    console.log(req.file);
    const image = req.file;
    return res.status(200).json({ path: "`Images/${image.filename}`" });
  } catch (error) {
    console.log({ error });
    res.status(422).json({ message: "upload failed" });
  }
});

// const imageUpload = async (req, res) => {
//   const { method } = req;
//   if (method === "POST") {
//     const form = new formidable.IncomingForm();
//     form.uploadDir = "../";
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//       console.log(files);
//     });
//   }
//   res.send("not post")
// };

export default imageUpload;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
