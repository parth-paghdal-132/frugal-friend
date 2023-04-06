const multer = require("multer")
const { ObjectId} = require("mongodb")
const fs = require("fs")
const gm = require('gm').subClass({ imageMagick: '7+' });

const ALLOWED_IMAGE_FILE_SIZE = 15728640
const ALLOWED_IMAGE_TYPE = ["image/jpeg", "image/jpg", "image/png"]

const mediaStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads/images")
    },
    filename: (req, file, callback) => {
        callback(null, getNewFileName(file))
    }
})

let uploadMediaFile = multer({storage: mediaStorage})
    .fields([{name: "profilePicture"}])

function getNewFileName(file){
    let extension = file.originalname
    extension = extension.split(".")
    extension = extension[extension.length - 1]
    let fileName =  new ObjectId().toString() + "." + extension
    return fileName
}

async function getFileNameForDB(filesInfo, errors) {
    let fileNameForDB = null
    let thumbName = null
    if(filesInfo) {
        let fileInfo = filesInfo[0]
        fileNameForDB = fileInfo.filename
        thumbName = await makeThumb(fileInfo.destination, fileInfo.filename)
        if(fileInfo.size > ALLOWED_IMAGE_FILE_SIZE){
            errors.profilePicture = "Image file should be less than 15 MB."
            errors.code = 403
            deleteUploadedFile(fileInfo.destination, fileNameForDB)
            throw errors
        }
        if(!ALLOWED_IMAGE_TYPE.includes(fileInfo.mimetype)){
            errors.profilePicture = "Image file should be in jpg, jpeg or png format."
            errors.code = 403
            deleteUploadedFile(fileInfo.destination, fileNameForDB)
            throw errors
        }
    }
    return {fileNameForDB, thumbName}
}

function makeThumb(filePath, fileName) {
    return new Promise(resolve => {
        gm(`${filePath}/${fileName}`)
            .resize(150,150)
            .write(`./uploads/thumbs/${fileName}`, (err) => {
                if(err){
                    resolve(null)
                } else {
                    resolve(fileName)
                }
            })
    })
}

function deleteUploadedFile(folderName, fileName) {
    fs.unlinkSync(`${folderName}/${fileName}`)
}

module.exports = {
    getFileNameForDB,
    uploadMediaFile
}
