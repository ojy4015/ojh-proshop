import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// describe where we want to our images to go: Amazon bucket or diskStorage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // null is for error
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // 'image'-${Date.now()}${path.extname(file.originalname)}
    );
  },
});

// filetype should be jpe?g, png, webp only
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });

// you can upload multiple files as an array
const uploadSingleImage = upload.single('image'); // 'image' is ${file.fieldname}

router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    });
  });
});

// router.post('/', upload.single('image'), (req, res) => {
//   res.status(200).send({
//     message: 'Image uploaded successfully',
//     image: `/${req.file.path}`, // image path which we can get from the request object
//   });
// } )

export default router;
