import User from '../models/user.models'
import errorHandler from './../helpers/dbErrorHandler'

async function updateFollowing(userId, followId, updateQuery) {
    try {
        //add following
        await User.findByIdAndUpdate(userId, {
            $push: {following: followId}
        })

        //Add follower
        let result = await User.findByIdAndUpdate(followId, updateQuery,
            {new: true})
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec()
        result.hashed_password = undefined
        result.salt = undefined
        return result;

    } catch (err) {
        return errorHandler.getErrorMessage(err);
    }
}

const followUser = async (userId, followId) => {
    let updateQuery = { $push: { followers: userId } };
    return updateFollowing(userId, followId, updateQuery);
}

const unfollowUser = async (userId, unfollowId) => {
    let updateQuery = { $pull: { followers: userId } };
    return updateFollowing(userId, unfollowId, updateQuery);
}

const findPeopleToFollow = async (profile) => {
    let following = profile.following
    following.push(profile._id)
    try {
        return await User.find({_id: {$nin: following}}).select('name')
    } catch (err) {
        return errorHandler.getErrorMessage(err)
    }
}

export {followUser, unfollowUser, findPeopleToFollow}