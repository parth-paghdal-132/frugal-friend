const NAME_PATTERN = /^(?=.{2,10}$)[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{4,}$/
const PASSWORD_PATTERN = /(?=.*[A-Z])(?=.*[.+!@#$%^&*()_\-={}[\]|;:'",<.>/?])(?=.*[0-9])/
// this facebook profile validation pattern were borrowed from https://stackoverflow.com/a/35356494
const FB_PATTERN = /(^https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9_.-]+\/?)/i
// this instagram profile validation pattern were borrowed from https://regex101.com/r/Ci3DA9/1
const IG_PATTERN = /(^https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?/i
// this twitter profile validation pattern were borrowd from https://regexr.com/4tsfr
const TWITTER_PATTERN = /(^https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?/i

function validateMyProfileData(firstName, lastName, bio, username, fbLink, igLink, twitterLink, errors) {
    if(!firstName) {
        errors.firstName = "Please provide first name."
    }
    if(!lastName) {
        errors.lastName = "Please provide last name."
    }
    if(!username) {
        errors.username = "please provide username."
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

    if(bio && typeof bio !== "string") {
        errors.bio = "Please provide bio in string format."
    }
    
    if(typeof username !== "string") {
        errors.username = "Please provide username in string format."
    }

    if(fbLink && typeof fbLink !== "string") {
        errors.fbLink = "Please provide valid facebook link."
    }

    if(igLink && typeof igLink !== "string") {
        errors.igLink = "Please provide valid instagram link."
    }

    if(twitterLink && typeof twitterLink !== "string") {
        errors.twitterLink = "Please provide valid twitter link."
    }

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!NAME_PATTERN.test(firstName)) {
        errors.firstName = "Please provide valid first name."
    }

    if(!NAME_PATTERN.test(lastName)) {
        errors.lastName = "Please provide valid last name."
    }

    if(!USERNAME_PATTERN.test(username)) {
        errors.username = "Please provide valid username."
    }

    if(fbLink && !FB_PATTERN.test(fbLink)) {
        errors.fbLink = "Please provide valid facebook link."
    }

    if(igLink && !IG_PATTERN.test(igLink)) {
        errors.igLink = "Please provide valid instagram link."
    }

    if(twitterLink && !TWITTER_PATTERN.test(twitterLink)){
        errors.twitterLink = "Please provide valid twitter link."
    }

    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

function checkChangePasswords(currentPassword, newPassword, confirmPassword, errors) {
    if(!currentPassword) {
        errors.currentPassword = "Please provide current password."
    }
    if(!newPassword) {
        errors.newPassword = "Please provide new password."
    }
    if(!confirmPassword) {
        errors.confirmPassword = "Please provide confirm password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(typeof currentPassword !== "string") {
        errors.currentPassword = "Please provide current password in string format."
    }
    if(typeof newPassword !== "string") {
        errors.newPassword = "Please provide new password in string format."
    }
    if(typeof confirmPassword !== "string") {
        errors.confirmPassword = "Please provide confirm password in string format."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!PASSWORD_PATTERN.test(currentPassword)) {
        errors.currentPassword = "Please provide valid current password."
    }
    if(!PASSWORD_PATTERN.test(newPassword)){
        errors.newPassword = "Please provide valid new password."
    }
    if(!PASSWORD_PATTERN.test(confirmPassword)) {
        errors.confirmPassword = "Please provide valid confirm password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(newPassword !== confirmPassword) {
        errors.confirmPassword = "Confirm password do not match with new password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

function checkSetPasswords(newPassword, confirmPassword, errors) {
    if(!newPassword) {
        errors.newPassword = "Please provide new password."
    }
    if(!confirmPassword) {
        errors.confirmPassword = "Please provide confirm password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(typeof newPassword !== "string") {
        errors.newPassword = "Please provide new password in string format."
    }
    if(typeof confirmPassword !== "string") {
        errors.confirmPassword = "Please provide confirm password in string format."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(!PASSWORD_PATTERN.test(newPassword)){
        errors.newPassword = "Please provide valid new password."
    }
    if(!PASSWORD_PATTERN.test(confirmPassword)) {
        errors.confirmPassword = "Please provide valid confirm password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }

    if(newPassword !== confirmPassword) {
        errors.confirmPassword = "Confirm password do not match with new password."
    }
    if(Object.keys(errors).length > 0) {
        errors.code = 403
        throw errors
    }
}

module.exports = {
    validateMyProfileData,
    checkChangePasswords,
    checkSetPasswords
}