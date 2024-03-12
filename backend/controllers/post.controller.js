const postModel = require("../models/post.model");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = async (req, res) => {
const docs = await PostModel.find().sort({ createdAt: -1 });
res.send(docs);
};

// Création de post
module.exports.createPost = async (req, res) => {
  let = fileName;
  if (req.file != null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image.jpeg"
      )
        throw Error("invalid file");
  
      if (req.file.size > 600000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }
  
    fileName = req.body.posterId + Date.now() + '.jpg';

    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__direname}/../client/public/upload/posts/${fileName}`
      )
    );
  }
  
  const newPost = new postModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file != null ? "./upload/posts/" + fileNale : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//Modification de post
module.exports.udaptePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  const docs = await PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true }
  );
  if (!docs) {
    throw new Error("Error updating record");
  }
  res.send(docs);
};

//Suppression de post
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  const docs = await PostModel.findByIdAndRemove(req.params.id);
  if (!docs) {
    console.log("Delete error");
  } else {
    res.send(docs);
  }
};

//Liker un post
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    ).exec();
    if (!updatedPost) {
      return res.status(400).send("Post not found");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    ).exec();
    if (!updatedUser) {
      return res.status(400).send("User not found");
    }

    res.send(updatedUser);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//Unlike un post
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true }
    ).exec();
    if (!updatedPost) return res.status(400).send(err);

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true }
    ).exec();
    if (!updatedUser) return res.status(400).send(err);

    res.send(updatedUser);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//Commenter un post
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  try {
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    return res.send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//Modifier un commentaire de post
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  try {
    const docs = await PostModel.findById(req.params.id);
    const theComment = docs.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    if (!theComment) return res.status(404).send("Commentaire introuvable!");
    theComment.text = req.body.text;

    await docs.save();
    return res.status(200).send(docs);
  } catch (err) {
    return res.status(500).send(err);
  }
};

//Supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnue : " + req.params.id);

  try {
    const docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true }
    );
    return res.send(docs);
  } catch (err) {
    return res.status(400).send(err);
  }
};
