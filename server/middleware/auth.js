const jwt = require('jsonwebtoken')
const register = require('../model/user')

const auth = async (req, resp, next) => {
    try {
        const token = req.cookies.jwt;
        const userVerify = await jwt.verify(token, process.env.SECRET_KEY)
        const user = await register.findOne({ _id: userVerify._id })

        //for logout
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        resp.status(401).send('PLEASE! FIRST LOGIN THEN LOGOUT OR UPLOAD FILE')
    }
}
module.exports = auth;