const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  //destination: dung de xac dinh noi luu tru file upload
  destination: function (req, file, cb) {
    //dir: dung de xac dinh duong dan toi noi luu tru file upload
    //neu thu muc khong ton tai thi tao moi
    const dir = path.join(__dirname, "../public/images");
    return cb(null, dir);
  },
  //filename: dung de xac dinh ten file sau khi upload
  filename: function (req, file, cb) {
    //lay ten image + duoi hinh anh
    cb(null, file.originalname);
  },
});

//imageFileFilter: dung de kiem tra file upload co phai la file anh hay khong
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb({ error: "You can only upload image files!" }, false);
  }
  cb(null, true);
};

//upload: dung de upload file
const upload = multer({ storage: storage, fileFilter: imageFileFilter });
module.exports = upload;
