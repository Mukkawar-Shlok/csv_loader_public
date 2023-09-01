const mongoose = require('mongoose');

//for file storage
const multer = require('multer');
const path = require('path');
const FILEPATH = path.join('/uploads/files');

const fileSchema = new mongoose.Schema({
    fileCsv: {
        type: String
    },
    fileName: {
        type: String
    }

});


//multer function for storing data into local file system
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', FILEPATH));
    },
    filename: function (req, file, cb) {
        //create unique code for file name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.csv'); // Change the filename to the desired format
    }
});


//static 
fileSchema.statics.uploadedFile = multer({ storage: storage }).single('csvFile');
fileSchema.statics.uploadPath = FILEPATH;

const File = mongoose.model('files', fileSchema);

module.exports = File;