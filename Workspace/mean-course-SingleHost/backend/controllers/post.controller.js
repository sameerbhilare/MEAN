const mongoose = require("mongoose");
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename, // added by multer
    creator: req.userData.userId, // saved in the checkAuth middleware
  });
  // save to DB
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a Post failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    // if file was actually uploaded
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename; // added by multer
  }

  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    { title: req.body.title, content: req.body.content, imagePath: imagePath }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Post updated successfully.",
          creator: req.userData.userId, // saved in the checkAuth middleware
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Updating the Post failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  // fetch all posts from DB
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json("Post Not Found !");
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Some problem while getting the Post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching the Posts failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  // fetch all posts from DB
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Posts Deleted",
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting the Post failed!",
      });
    });
};
