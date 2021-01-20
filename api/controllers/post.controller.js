import formidable from "formidable";

import {getNewsfeedPosts, createPost, getPostByID, deletePost, listPostsByUser}
    from "/app/usecases/posts"

import {likePost, unlikePost} from "/app/usecases/likes";
import {addComment, removeComment} from "/app/usecases/comments";

const getNewsFeed = async (req, res) => {
    let following = req.profile.following
    let profileId = req.profile._id;

    let posts = await getNewsfeedPosts(following, profileId);

    if (typeof (posts) == 'string') {
        return res.status(400).json({
            error: posts
        })
    }

    res.json(posts);
}

const listByUser = async (req, res) => {
    const result = await listPostsByUser(req.profile)
    if (typeof (result) == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    return res.json(result)
}

const create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        const result = await createPost(req.profile, fields, files)
        if (typeof (result) == 'string') {
            return res.status(400).json({
                error: result
            })
        }

        res.json(result)
    })
}

const postByID = async (req, res, next, id) => {
    let post = await getPostByID(id)

    if (typeof (post) == 'string') {
        return res.status('400').json(
            {error: post}
        )
    }

    req.post = post
    next()
}

const uploadPhoto = (req, res) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth &&
        req.post.postedBy._id == req.auth._id

    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

const remove = async (req, res) => {
    console.log("Remove it serverside! " + req.post)
    const result = await deletePost(req.post);
    if (typeof (result) == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result);
}

const like = async (req, res) => {
    let result = await likePost(req.body.postId, req.body.userId)
    if (typeof result == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result)
}

const unlike = async (req, res) => {
    let result = await unlikePost(req.body.postId, req.body.userId)
    if (typeof result == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result)
}

const comment = async (req, res) => {
    let result = await addComment(req.body.comment, req.body.userId, req.body.postId)

    if (typeof result == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result)
}

const uncomment = async (req, res) => {
    let result = await removeComment(req.body.comment, req.body.userId, req.body.postId)

    if (typeof result == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result)
}

export default {
    getNewsFeed, listByUser, create, photo: uploadPhoto, postByID, isPoster, remove, like, unlike,
    comment, uncomment
}