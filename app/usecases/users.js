import User from '../models/user.models'
import errorHandler from './../helpers/dbErrorHandler'
import extend from "lodash/extend";
import fs from "fs";

const createUser = async (userData) => {
    const user = new User(userData)
    try {
        await user.save();
        return true
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const readUser = async (id) => {
    try {
        let user = await User.findById(id).populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        if (!user) return "User not found"

        return user
    } catch (err) {
        return "Could not retrieve user"
    }
}

const listUsers = async () => {
    try {
        let users = await User.find().select('name email updated created')
        return users;
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

const updateUser = async (user, updateData, files) => {
    try {
        console.log("In here!")
        user = extend(user, updateData)
        user.updated = Date.now()
        if (files.photo){
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
            console.log("Did the photo file!")
        }

        await user.save()
        console.log("Saved!")
        user.hashed_password = undefined
        user.salt = undefined
        return user;
    } catch (err) {
        return errorHandler.getErrorMessage(err);
    }
}

const deleteUser = async (user) => {
    try {
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        return deletedUser
    } catch (err) {
        return errorHandler.getErrorMessage(err);
    }
}

const authenticateUser = async (email, password) => {
    try {
        let user = await User.findOne({
            "email": email
        })

        if (!user) {
            return "User not found"
        }

        if (!user.authenticate(password)) {
            return "Email and password don't match."
        }

        return user;

    } catch (err) {
        return "Could not sign in"
    }
}

export  {createUser,readUser, authenticateUser, deleteUser, listUsers, updateUser}