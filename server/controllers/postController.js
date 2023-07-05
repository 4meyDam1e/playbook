import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";

//@route  POST api/posts
//@desc   [DESCRIPTION OF WHAT ROUTE DOES]
//@access [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const createPost = asyncHandler(async (req, res) => {
    
});

//@route   GET api/posts
//@desc    [DESCRIPTION OF WHAT ROUTE DOES]
//@access  [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const getPosts = asyncHandler(async (req, res) => {

});

//@route   GET api/posts/:id
//@desc    [DESCRIPTION OF WHAT ROUTE DOES]
//@access  [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const getPost = asyncHandler(async (req, res) => {

});

//@route PUT api/posts/:id
//@desc  [DESCRIPTION OF WHAT ROUTE DOES]
//@access [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const updatePost = asyncHandler(async (req, res) => {
    
});

//@route DELETE api/posts/:id
//@desc  [DESCRIPTION OF WHAT ROUTE DOES]
//@access [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const deletePost = asyncHandler(async (req, res) => {
    
});

//@route   PATCH api/posts/:id/react
//@desc    [DESCRIPTION OF WHAT ROUTE DOES]
//@access  [WHETHER PUBLIC OR PRIVATE i.e. LOGGED IN USER CAN ACCESS IT OR NOT]
const reactToPost = asyncHandler(async (req, res) => {
  try {
    const { reaction } = req.body; // Taking reaction type from the request body
    const user = req.user.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Gettting the index of the reaction to update
    const reactionIndex = post.likes.findIndex(like => like.user.toString() === user);

    if (reactionIndex === -1) {
      // If the user has not reacted to the post before, add reaction
      post.likes.unshift({ user, reaction });
    } else {
      if (reaction === post.likes[reactionIndex].reaction) {
        // If the user clicked the same reaction again, remove reaction
        post.likes.splice(reactionIndex, 1);
      } else {
        // If the user clicked a different reaction, change reaction
        post.likes[reactionIndex].reaction = reaction;
      }
    }

    await post.save();
    res.json(post.likes);
    return res.status(200).json({ msg: "Reaction successful" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

export {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    reactToPost
};
