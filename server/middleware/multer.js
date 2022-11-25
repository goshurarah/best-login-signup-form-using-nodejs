const multer = require('multer')

var date = Date.now()
var todayDate = new Date(date).toDateString()

let uploadFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploaded files')
    },
    filename: (req, file, cb) => {
        cb(null, todayDate + ' ' + file.originalname)
    }
})
let upload = multer({ storage: uploadFile }).single('file')
module.exports = upload