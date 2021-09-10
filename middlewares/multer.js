const multer = require("multer");

const avatarMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
/* ****** Upload Avatar  ***** */
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatar");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: function (req, file, cb) {
    if (avatarMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(
      new Error(
        "La extension de la imagen no es valida. (Extensiones permitidas: .png y .jpg)"
      )
    );
  },
});


exports.uploadAvatarMD = (req, res, next) => {
  const upload = uploadAvatar.single("avatar");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

/* ****** Upload Compe  ***** */
const avatarCompeTypes = ["application/pdf"];

const compeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/competencias");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name);
  },
});

const uploadCompe = multer({
  storage: compeStorage,
  fileFilter: function (req, file, cb) {
    if (avatarCompeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(
      new Error(
        "La extension de la documento no es valida. (Extensiones permitidas: .pdf)"
      )
    );
  },
});

exports.uploadCompeMD = (req, res, next) => {
  const upload = uploadCompe.single("compe");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
