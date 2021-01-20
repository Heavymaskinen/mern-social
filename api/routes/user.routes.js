import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)

router.route('/api/resources/photo/:userId')
    .get(userCtrl.photo, userCtrl.defaultPhoto)

router.route('/api/resources/defaultphoto')
    .get(userCtrl.defaultPhoto)

router.route('/api/actions/follow')
    .put(authCtrl.requireSignin, userCtrl.addFollowing)

router.route('/api/actions/unfollow')
    .put(authCtrl.requireSignin, userCtrl.removeFollowing)

router.route('/api/actions/findpeople/:userId')
    .get(authCtrl.requireSignin, userCtrl.findPeople)

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router