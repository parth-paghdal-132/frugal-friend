const { ObjectId } = require("mongodb")

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const NAME_PATTERN = /^(?=.{2,10}$)[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{4,}$/
const PASSWORD_PATTERN = /(?=.*[A-Z])(?=.*[.+!@#$%^&*()_\-={}[\]|;:'",<.>/?])(?=.*[0-9])/
const LOGIN_SOURCE_APP = "app"
const LOGIN_SOURCE_GOOGLE = "google"
const LOGIN_SOURCE_ARRAY = [LOGIN_SOURCE_APP, LOGIN_SOURCE_GOOGLE]

function validateCreateUserData(firstName, lastName, email, username, password, confirmPassword, source, errors) {
    if(!firstName){
        errors.firstName = "Please provide first name."
    }
    if(!lastName) {
        errors.lastName = "Please provide last name."
    }
    if(!email) {
        errors.email = "Please provide email."
    }
    if(!username) {
        errors.username = "Please provide username."
    }
    if(!password) {
        errors.password = "Please provide password."
    }
    if(!confirmPassword) {
        errors.confirmPassword = "Please provide confirm password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(typeof firstName !== "string") {
        errors.firstName = "Please provide first name in string format."
    }
    if(typeof lastName !== "string") {
        errors.lastName = "Please provide last name in string format."
    }
    if(typeof email !== "string") {
        errors.email = "Please provide email in string format."
    }
    if(typeof username !== "string") {
        errors.username = "Please provide username in string format."
    }
    if(typeof password !== "string") {
        errors.password = "Please provide password in string format."
    }
    if(typeof confirmPassword !== "string") {
        errors.confirmPassword = "Please provide confirm password in string format."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!NAME_PATTERN.test(firstName)){
        errors.firstName = "Please provide valid first name."
    }
    if(!NAME_PATTERN.test(lastName)){
        errors.lastName = "Please provide valid last name."
    }
    if(!EMAIL_PATTERN.test(email)){
        errors.email = "Please provide valid email."
    }
    if(!USERNAME_PATTERN.test(username)){
        errors.username = "Please provide valid username."
    }
    if(!PASSWORD_PATTERN.test(password)){
        errors.password = "Please provide valid password."
    }
    if(!PASSWORD_PATTERN.test(confirmPassword)){
        errors.confirmPassword = "Please provide valid confirm password."
    }    

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(password !== confirmPassword) {
        errors.password = "Password do not match with confirm password."
        errors.confirmPassword = "Confirm password do not match with password."
    }

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

function validateAuthenticateUser(email, password, source, errors) {
    if(!email) {
        errors.email = "Please provide email."
    }
    if(!password) {
        errors.password = "Please provide password."
    }
    if(!source) {
        errors.other = "Bad value supplied."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(typeof email !== "string") {
        errors.email = "Please provide email in string format."
    }
    if(typeof password !== "string") {
        errors.password = "Please provide password in string format."
    }
    if(typeof source !== "string"){
        errors.other = "Bad value supplied."
    }

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!EMAIL_PATTERN.test(email)){
        errors.email = "Please provide valid email."
    }
    if(!PASSWORD_PATTERN.test(password)){
        errors.password = "Please provide valid password."
    }
    if(!LOGIN_SOURCE_ARRAY.includes(source)) {
        errors.other = "Bad value supplied."
    }
    
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

function isValidUserId(userId, errors) {
    if(!userId) {
        errors.userId = "Please provide userId."
        errors.code = 403
        throw errors
    }
    if(typeof userId !== "string") {
        errors.userId = "Please provide userId in string format."
        errors.code = 403
        throw errors
    }

    if(!ObjectId.isValid(userId)){
        errors.userId = "Please provide valid userId."
        errors.code = 403
        throw errors
    }
}

function isValidEmail(email, errors) {
    if(!email) {
        errors.email = "Please provide email."
        errors.code = 403
        throw errors
    }

    if(typeof email !== "string") {
        errors.email = "Please provide email in string format."
        errors.code = 403
        throw errors
    }

    if(!EMAIL_PATTERN.test(email)){
        errors.email = "Please provide valid email."
        errors.code = 403
        throw errors
    }
}

function validateGoogleLoginData(email, displayName, source, errors) {
    if(!email) {
        errors.email = "Please provide email."
    }
    if(!source) {
        errors.other = "Bad value supplied."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(typeof email !== "string") {
        errors.email = "Please provide email in string format."
    }
    if(typeof source !== "string"){
        errors.other = "Bad value supplied."
    }

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!EMAIL_PATTERN.test(email)){
        errors.email = "Please provide valid email."
    }
    if(!LOGIN_SOURCE_ARRAY.includes(source)) {
        errors.other = "Bad value supplied."
    }
    
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

function getNames(displayName) {
    let firstName = null
    let lastName = null

    if(!displayName) {
        return {firstName, lastName}
    }
    if(typeof displayName !== "string") {
        return {firstName, lastName}
    }
    let names = displayName.split(" ")
    if(names.length <= 0) {
        return {firstName, lastName}
    }

    if(names.length >= 1) {
        firstName = names[0]
    }
    if(names.length >= 2) {
        lastName = names[1]
    }    
    return {firstName, lastName}
}

module.exports = {
    validateCreateUserData,
    validateAuthenticateUser,
    isValidUserId,
    isValidEmail,
    validateGoogleLoginData,
    getNames
}