const jwt = require('jsonwebtoken')
const bcryot = require('bcryptjs')
const asyncHandlerr = require('express-async-handler')
const User = require('../models/UserModel')


// @desc Register new user
// @route POST /api/users
// @access Public

const registerUser = asyncHandlerr( async(req, res) => {
    const {name, email, password} = req.body 

    if(!name || !email || !password ) {
    res.status(400)
    throw new Error('Please add all fields')
}

// check if user exists
const userExists = await User.findOne({email})

if (userExists){
    res.status(400)
    throw new Error('User already there')
}

// hash password
const salt = await bcryot.genSalt(10)
const hashedPassowrd = await bcryot.hash(password, salt)

// Create user
const user = await User.create({
    name,
    email,
    password: hashedPassowrd
})

if(user){
    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    })
}
else {
    res.status(400)
    throw new Error('Invalid User data')
}
})

// @desc Authenticate a user
// @route POST /api/login
// @access Public

const loginUser = asyncHandlerr(async(req, res) => {

    const {email, password} = req.body

    //Check for user email

    const user = await User.findOne({email})

    if (user && (await bcryot.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

// @desc Get user data
// @route GET /api/users/me
// @access Private

const getMe = asyncHandlerr( async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)
    
    res.status(200).json({
      id: _id,
      name,
      email,  
    })
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}