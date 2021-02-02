const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const postController = require("../controllers/post.controller");

const router = express.Router();

const MIME_TYPES_MAP = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};

// initialize multer storage - to store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPES_MAP[file.mimetype];
    let error = null;
    if (!isValid) {
      error = new Error("Invalid mime type");
    }
    cb(error, "backend/images");
  },

  // this filename will be set be multer and will be available at req.file.filename
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPES_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

// POST - create a post
router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.createPost
);

// UPDATE a post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  postController.updatePost
);

// GET a post
router.get("/:id", postController.getPost);

// GET - get all psots
router.get("", postController.getPosts);

// DELETE a post
router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;
