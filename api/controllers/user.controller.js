import formidable from 'formidable'
import profileImage from '/frontend/assets/images/profile-pic.png'

import {createUser, readUser, updateUser, listUsers, deleteUser} from '/app/usecases/users'

import {followUser, unfollowUser, findPeopleToFollow} from '/app/usecases/follow'

const findPeople = async (req, res) => {
    const result = await findPeopleToFollow(req.profile);
    if (typeof (result) == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result)
}

const addFollowing = async (req, res) => {
    const result = await followUser(req.body.userId, req.body.followId)
    if (typeof (result) == 'string') {
        return res.status(400).json({error: result})
    }

    return res.json(result)
}

const removeFollowing = async (req, res) => {
    const result = await unfollowUser(req.body.userId, req.body.unfollowId)
    if (typeof (result) == 'string') {
        return res.status(400).json({error: result})
    }

    return res.json(result)
}

const create = async (req, res) => {
    const result = await createUser(req.body);
    if (result === true) {
        return res.status(200).json({message: "Successfully signed up!"})
    }

    return res.status(400).json({error: result})
}

const list = async (req, res) => {
    let users = await listUsers()
    if (typeof (users) == 'string') {
        return res.status(400).json({
            error: users
        })
    }

    res.json(users)
}

const userByID = async (req, res, next, id) => {
    const result = await readUser(id);
    if (typeof (result) == 'string' || !result) {
        return res.status('400').json({
            error: result
        })
    }

    req.profile = result;
    next();
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const update = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log("Error: " + err)
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }

        const result = await updateUser(req.profile, fields, files);
        if (typeof (result) == 'string') {
            return res.status(400).json({
                error: result
            })
        }

        res.json(result);
    })

}

const remove = async (req, res) => {
    const result = await deleteUser(req.profile);
    if (typeof (result) == 'string') {
        return res.status(400).json({
            error: result
        })
    }

    res.json(result);
}

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }

    next()
}

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + profileImage)
}

export default {
    create, remove, read, list, userByID, update, photo, defaultPhoto, addFollowing, removeFollowing,
    findPeople
}