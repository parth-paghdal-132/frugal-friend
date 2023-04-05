const express = require("express")
const xss = require("xss")
const bcryptJS = require("bcryptjs")
const data = require("../data")
const uploader = require("../helpers/uploader")
const usersValidations = require("../helpers/usersValidations")
const authValidations = require("../helpers/authValidations")

const router = express.Router()
const myProfileData = data.myProfileData
const authData = data.authData

router
    .route("/")
    .get(async (req, res) => {
        let errors = {}
        if(!req.session.user) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        let userId = req.session.user._id.toString()
        try {
            authValidations.isValidUserId(userId, errors)
        } catch (exception) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        try {
            let user = await authData.getUser(userId)
            if(user) {
                user.isPasswordSet = !(!user.password)
                delete user.password
                return res.status(200).json(user)
            } else {
                return res.status(500).json({other: "Can not fetch your data at this moment. Please try after some time."})
            }
        } catch(exception) {
            let code = 400
            if(exception.code) {
                code = exception.code
            }
            if(exception.code === 403 || exception.code === 404) {
                errors.other = "Please login into app to update your profile"
                errors.sessionExpired = true
            }
            return res.status(code).json(exception)
        }
    })

router
    .route("/updateInformation")
    .put(uploader.uploadMediaFile, async (req, res) => {
        let errors = {}
        if(!req.session.user) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }
        
        let imageFilesInfo = req.files["profilePicture"]

        let profilePictureName = null
        let thumbName = null
        try {
            let fileNames = await uploader.getFileNameForDB(imageFilesInfo, errors)
            profilePictureName = fileNames.fileNameForDB
            thumbName = fileNames.thumbName

        } catch (exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }
        let firstName = xss(req.body.firstName).trim()
        let lastName = xss(req.body.lastName).trim()
        let bio = xss(req.body.bio).trim()
        let email = xss(req.body.email).trim()
        let username = xss(req.body.username).trim()
        let fbLink = xss(req.body.fbLink).trim()
        let igLink = xss(req.body.igLink).trim()
        let twitterLink = xss(req.body.twitterLink).trim()
        
        try{
            usersValidations.validateMyProfileData(firstName, lastName, bio, username, fbLink, igLink, twitterLink, errors)
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }

        let userFromSession = req.session.user
        if(email !== userFromSession.email) {
            errors.code = 401
            errors.other = "Trying to update some one elses profile."
            return res.status(401).json(errors)
        }

        try {
            let updatedUser = await myProfileData.updateProfile(profilePictureName, thumbName, firstName, lastName, bio, username, fbLink, igLink, twitterLink, userFromSession.email)
            if(updatedUser && updatedUser.data) {
                updatedUser.data = !(!updatedUser.data.password)
                delete updatedUser.data.password
                req.session.user = updatedUser.data
                updatedUser.data.token = req.session.id
                return res.status(200).json(updatedUser.data)
            } else {
                return res.status(500).json({other: "Could not update your profile information at this moment. Please try after some time."})
            }
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }
    })

router
    .route("/changePassword")
    .patch(async (req, res) => {
        let errors = {}
        if(!req.session.user) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        let userId = req.session.user._id.toString()
        try {
            authValidations.isValidUserId(userId, errors)
        } catch (exception) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        let currentPassword = xss(req.body.currentPassword).trim()
        let newPassword = xss(req.body.newPassword).trim()
        let confirmPassword = xss(req.body.confirmPassword).trim()

        try {
            usersValidations.checkChangePasswords(currentPassword, newPassword, confirmPassword, errors)
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }

        let userFromDB = null
        try {
            userFromDB = await authData.getUser(userId)
            if(!userFromDB.password) {
                errors.otherPasswords = "It looks like you have not set password yet. Please set password first."
                errors.code = 400
                return res.status(400).json(errors)
            }
            let isMatch = await bcryptJS.compare(currentPassword, userFromDB.password)
            if(!isMatch) {
                errors.currentPassword = "Your current password is not matching with saved password."
                errors.code = 400
                return res.status(400).json(errors)
            }
        } catch(exception) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        try {
            let result = await myProfileData.changePassword(userId, currentPassword, newPassword, confirmPassword)
            if(result && result.data) {
                let user = result.data
                user.isPasswordSet = !(!user.password)
                delete user.password
                return res.status(200).json(user)
            }
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }
    })

router
    .route("/setPassword")
    .patch(async (req, res) => {
        let errors = {}
        if(!req.session.user) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        let userId = req.session.user._id.toString()
        try {
            authValidations.isValidUserId(userId, errors)
        } catch (exception) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        let newPassword = xss(req.body.newPassword).trim()
        let confirmPassword = xss(req.body.confirmPassword).trim()

        try {
            usersValidations.checkSetPasswords(newPassword, confirmPassword, errors)
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }

        let userFromDB = null
        try {
            userFromDB = await authData.getUser(userId)
            if(userFromDB.password) {
                errors.otherPasswords = "It looks like you already set password. Please change password if you wish."
                errors.code = 400
                return res.status(400).json(errors)
            }
        } catch(exception) {
            errors.other = "Please login into app to update your profile"
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }

        try {
            let result = await myProfileData.setPassword(userId, newPassword, confirmPassword)
            if(result && result.data) {
                let user = result.data
                user.isPasswordSet = !(!user.password)
                delete user.password
                return res.status(200).json(user)
            }
        } catch(exception) {
            let code = 403
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }

    })

module.exports = router