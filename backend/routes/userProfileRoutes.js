const express = require("express")
const xss = require("xss")
const authValidations = require("../helpers/authValidations")
const data = require("../data")

const router = express.Router()
const authData = data.authData

router
    .route("/:userId")
    .get(async (req, res) => {
        let errors = {}
        if(!req.session.user) {
            errors.other = "Please login see others' profile."
            errors.sessionExpired = true
            errors.code = 403
            return res.status(403).json(errors)
        }
        let userId = xss(req.params.userId).trim()
        try {
            authValidations.isValidUserId(userId, errors)
        } catch (exception) {
            errors.other = "Invalid user id supplied."
            errors.code = 403
            return res.status(403).json(errors)
        }

        try {
            let user = await authData.getUser(userId)
            if(user){
                delete user.password
                return res.status(200).json(user)
            } else {                
                return res.status(500).json({other: "Can not fetch data at this moment. Please try after some time."})
            }
        } catch(exception) {
            let code = 400
            if(exception.code) {
                code = exception.code
            }
            return res.status(code).json(exception)
        }
    })

module.exports = router