const mongoCollections = require("../config/mongoCollections")
const bcrypt = require("bcryptjs")
const authValidations = require("../helpers/authValidations")
const { ObjectId } = require("mongodb")
const xss = require("xss")

const users = mongoCollections.users

const createUser = async (firstName, lastName, email, username, password, confirmPassword, signUpSource) => {
    let errors = {}
    firstName = xss(firstName).trim()
    lastName = xss(lastName).trim()
    email = xss(email).trim()
    username = xss(username).trim()
    password = xss(password).trim()
    confirmPassword = xss(confirmPassword).trim()

    authValidations.validateCreateUserData(firstName, lastName, email, username, password, confirmPassword, signUpSource, errors)

    const userCollection = await users()
    const exist = await userCollection.findOne({ $or: [{ email }, { username }] })
    if(exist) {
        errors.other = "Either the email or username exists."
        errors.code = 400
        throw errors
    }

    const salt = 10
    const hashedPassword = await bcrypt.hash(password, salt)

    const insertInfo = await userCollection.insertOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        username: username,
        signUpSource: signUpSource
    })
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        errors.other = "Could not create user at this moment please try after some time."
        errors.code = 500
        throw errors
    }

    let user = await getUser(insertInfo.insertedId.toString())
    return {data: user, code: 200}
}

const authenticateUser = async (email, password, loginSource) => {
    let errors = {}
    email = xss(email).trim()
    password = xss(password).trim()
    loginSource = xss(loginSource).trim()

    authValidations.validateAuthenticateUser(email, password, loginSource, errors)

    let user = await getUserByEmail(email)
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        errors.other = "Either the email or password is wrong."
        errors.code = 401
        throw errors
    }
    return {data:user, code: 200}
}

const getUser = async (userId) => {
    let errors = {}
    userId = xss(userId).trim()
    authValidations.isValidUserId(userId, errors)

    const userCollection = await users()
    const user = await userCollection.findOne({_id: new ObjectId(userId)})
    if(!user) {
        errors.other = "No user found"
        errors.code = 404
        throw errors
    }
    return user
}

const getUserByEmail = async (email) => {
    let errors = {}
    email = xss(email).trim()
    authValidations.isValidEmail(email, errors)

    const userCollection = await users()
    const user = await userCollection.findOne({email: email})
    if(!user) {
        errors.other = "No user found"
        errors.code = 404
        throw errors
    }
    return user
}

module.exports = {
    createUser,
    authenticateUser
}