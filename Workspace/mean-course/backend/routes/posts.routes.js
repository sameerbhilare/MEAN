const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

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
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename, // added by multer
      creator: req.userData.userId, // saved in the checkAuth middleware
    });
    // save to DB
    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

// UPDATE a post
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      // if file was actually uploaded
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename; // added by multer
    }

    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      { title: req.body.title, content: req.body.content, imagePath: imagePath }
    ).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Post updated successfully.",
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    });
  }
);

// GET a post
router.get("/:id", (req, res, next) => {
  // fetch all posts from DB
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json("Post Not Found !");
    }
  });
});

// GET - get all psots
router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;

  let findQuery = Post.find();

  if (pageSize && currentPage) {
    findQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  let fetchedPosts;
  // fetch all posts from DB
  findQuery
    .then((posts) => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts Fetched successfully",
        posts: fetchedPosts,
        totalPosts: count,
      });
    });
});

// DELETE a post
router.delete("/:id", checkAuth, (req, res, next) => {
  // fetch all posts from DB
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Posts Deleted",
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    }
  );
});

module.exports = router;
