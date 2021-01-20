import Post from "../models/post.model";
import fs from "fs";
import errorHandler from "../helpers/dbErrorHandler";

const createPost = async (profile, fields, files) => {
    let post = new Post(fields)
    post.postedBy = profile

    if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path)
        post.photo.contentType = files.photo.type
    }

    try {
        let result = await post.save()
        return result
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const deletePost = async (post) => {
    try {
        return await post.remove()
    } catch (err) {
        return errorHandler.getErrorMessage(err);
    }
}

const listPostsByUser = async (profile) => {
    try {
        let posts = await Post.find({postedBy: profile._id})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()
        return posts;
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const getNewsfeedPosts = async (following, profileId) => {
    following.push(profileId)

    try {
        return await Post.find({
            postedBy: {
                $in: following
            }
        }).populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec()
    } catch (err) {
        console.log("Feed fail: " + err)
        return errorHandler.getErrorMessage(err);
    }
}

const getPostByID = async (id) => {
    try {
        let post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .exec()
        if (!post)
            return "Post not found"

        return post
    } catch (err) {
        return "Could not retrieve post"
    }
}

export {deletePost, getPostByID, createPost, getNewsfeedPosts, listPostsByUser}