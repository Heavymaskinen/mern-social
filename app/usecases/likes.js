import Post from "../models/post.model";
import errorHandler from "../helpers/dbErrorHandler";

const likePost = async (postId, userId) => {
    try {
        let result = await Post.findByIdAndUpdate(postId, {$push: {likes: userId}},
            {new: true})
        return result
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const unlikePost = async (postId, userId) => {
    try {
        let result = await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}},
            {new: true})
        return result
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

export {likePost, unlikePost}