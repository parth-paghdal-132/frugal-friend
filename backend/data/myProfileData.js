const mongoCollections = require("../config/mongoCollections")
const usersValidations = require("../helpers/usersValidations")
const authValidations = require("../helpers/authValidations")
const xss = require("xss")
const bcryptJS = require("bcryptjs")
const authData = require("./authData")
const rewardData = require('./rewardData');
const { ObjectId } = require("mongodb")

const users = mongoCollections.users

const updateProfile = async (image, thumb, firstName, lastName, bio, username, fbLink, igLink, twitterLink, isProfilePictureChanged, email) => {
    let errors = {}
    firstName = xss(firstName).trim()
    lastName = xss(lastName).trim()
    bio = xss(bio).trim()
    username = xss(username).trim()
    fbLink = xss(fbLink).trim()
    igLink = xss(igLink).trim()
    twitterLink = xss(twitterLink).trim()
    email = xss(email).trim()

    usersValidations.validateMyProfileData(firstName, lastName, bio, username, fbLink, igLink, twitterLink, errors)

    let userFromDB = await authData.getUserByEmail(email)
    if(userFromDB.username !== username) {
        let usernameExists = await isUsernameExists(username, email)
        if(usernameExists) {
            errors.other = "username is already in use."
            errors.code = 409
            throw errors
        }
    }


    // update stored user in redis
    let userToUpdate = {
        userId: userFromDB._id.toString(),
        username: username,
        firstName: firstName,
        lastName: lastName,
    }
    
    if(isProfilePictureChanged){
        userToUpdate.image = image
    }

    rewardData.updateUserInRedis(userFromDB, userToUpdate);

    if(isProfilePictureChanged){
        
        
        userFromDB.image = image
        userFromDB.thumb = thumb
    }
    
    userFromDB.firstName = firstName
    userFromDB.lastName = lastName
    userFromDB.bio = bio
    userFromDB.username = username
    userFromDB.fbLink = fbLink
    userFromDB.igLink = igLink
    userFromDB.twitterLink = twitterLink

    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({
        email: email
    }, {
        $set: userFromDB
    })

    if (updateInfo.matchedCount === 1 && updateInfo.modifiedCount === 0) {

    } else if (updateInfo.modifiedCount === 0) {
        errors.other = "Could not update your profile information at this moment. Please try after some time."
        errors.code = 400
        throw errors
    }
    let updatedUser = await authData.getUserByEmail(email)
    return {data: updatedUser, code: 200}
}

const isUsernameExists = async (username, email) => {
    username = xss(username).trim()
    email = xss(email).trim()

    const userCollection = await users()
    const condition = {
        $and: [
            { username: username.toLowerCase() },
            { email: email }
        ]
    }

    const userList = await userCollection.find(condition).toArray()
    if (userList === null) {
        return false
    }
    if (userList.length > 0) {
        return true
    }
    return false
}

const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    let errors = {}
    userId = xss(userId).trim()
    currentPassword = xss(currentPassword).trim()
    newPassword = xss(newPassword).trim()
    confirmPassword = xss(confirmPassword).trim()

    authValidations.isValidUserId(userId, errors)
    usersValidations.checkChangePasswords(currentPassword, newPassword, confirmPassword, errors)

    let userFromDB = await authData.getUser(userId)
    if(!userFromDB.password) {
        errors.otherPasswords = "It looks like you have not set password yet. Please set password first."
        errors.code = 400
        throw errors
    }
    let isMatch = await bcryptJS.compare(currentPassword, userFromDB.password)
    if(!isMatch) {
        errors.currentPassword = "Your current password is not matching with saved password."
        errors.code = 400
        throw errors
    }

    const salt = 10
    const hashedPassword = await bcryptJS.hash(newPassword, salt)
    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } })
    if (updateInfo.modifiedCount === 0) {
        errors.code = 500
        errors.otherPasswords = "Could not change your password at this moment. Please try after some time."
        throw errors
    }
    let updatedUser = await authData.getUser(userId)
    return {data: updatedUser, code: 200}
}

const setPassword = async (userId, newPassword, confirmPassword) => {
    let errors = {}
    userId = xss(userId).trim()
    newPassword = xss(newPassword).trim()
    confirmPassword = xss(confirmPassword).trim()

    authValidations.isValidUserId(userId, errors)
    usersValidations.checkSetPasswords(newPassword, confirmPassword, errors)

    let userFromDB = await authData.getUser(userId)
    if(userFromDB.password) {
        errors.otherPasswords = "It looks like you already set password. Please change password if you wish."
        errors.code = 400
        throw errors
    }

    const salt = 10
    const hashedPassword = await bcryptJS.hash(newPassword, salt)
    const userCollection = await users()
    const updateInfo = await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } })
    if (updateInfo.modifiedCount === 0) {
        errors.code = 500
        errors.otherPasswords = "Could not set your password at this moment. Please try after some time."
        throw errors
    }
    let updatedUser = await authData.getUser(userId)
    return {data: updatedUser, code: 200}

}

module.exports = {
    updateProfile,
    changePassword,
    setPassword
}