import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from '/config/config'
import {authenticateUser} from '/app/usecases/users'

const signin = async (req, res) => {
    let user = await authenticateUser(req.body.email, req.body.password);
    if (typeof (user) == 'string') {
        return res.status('401').send({
            error: user
        })
    }

    try {
        const token = jwt.sign({
            _id: user._id
        }, config.jwtSecret)

        res.cookie('t', token, {
            expire: new Date() + 9999
        })

        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        return res.status('401').json({
            error: "Could not sign in"
        })
    }
}

const signout = (req, res) => {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: config.jwtAlgorithms
})

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }

    next()
}

export default {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}