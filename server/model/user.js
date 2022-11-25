require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/Employ-Detail')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        uppercase: true,
        required: true
    },
    lastName: {
        type: String,
        uppercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        },
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        minlength: 11,
        maxlength: 12,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//generate tokens
userSchema.methods.generateAuthToken = (async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: token })
        await this.save()
        return token;
    } catch (error) {
        resp.status(401).send(error);
    }
})

// hash password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
        this.confirmPassword = await bcrypt.hash(this.password, 10)

        // //for removing of (confirmPassowrd) field in database
        // this.confirmPassword = undefined;
    }
    next()
})
let register = mongoose.model('users', userSchema);
module.exports = register;