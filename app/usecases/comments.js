import Post from "../models/post.model";
import errorHandler from "../helpers/dbErrorHandler";

const addComment = async (comment, userId, postId) => {
    comment.postedBy = userId
    try {
        return await Post.findByIdAndUpdate(postId, {$push: {comments: comment}},
            {new: true})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec()
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const removeComment = async (comment, userId, postId) => {
    comment.postedBy = userId
    try {
        return await Post.findByIdAndUpdate(postId, {$pull: {comments: comment}},
            {new: true})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec()
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

export {addComment, removeComment}