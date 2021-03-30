const multer = require("multer");
const nc = require("next-connect");
const path = require("path");
const DatauriParser = require("datauri/parser");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const TYPE_IMAGE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

  const storage = multer.memoryStorage();

  const fileUpLoad = multer({
  limits: 5000000,
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!TYPE_IMAGE[file.mimetype];
    let error = isValid ? null : new Error("Invalid type image");
    cb(error, isValid);
  },
});

const parser = new DatauriParser();
const formatBufferTo64 = fileFormat =>  parser.format(path.extname(fileFormat.originalname).toString(), fileFormat.buffer);
const cloudinaryUpload = file => cloudinary.uploader.upload(file);

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
    const image = req.file;
    const file64 = formatBufferTo64(image);
    const imageResult = await cloudinaryUpload(file64.content);
    return res.status(200).json({ path: imageResult.secure_url });
  } catch (error) {
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
