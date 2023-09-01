//file model
let File = require('../models/file');
//path for joining dirname of uploaded files
const path = require('path');
//fs for reading file and loading data in stream
const fs = require('fs');
//csv-parser for parsing the csv into json format
const csv = require('csv-parser');

//home controller
module.exports.home = async (req, res) => {
    try {
        //loading all uploaded files
        let listFiles = await File.find();
        return res.render('home', {
            fileList: listFiles
        });
    } catch (err) {
        //catch error and log it
        console.log(err);
        return res.status(500).send({ mesage: 'Ineternal Server Error' });
    }

};

module.exports.uploads = async (req, res) => {

    try {
        //use the static function declared in models File for storing file in local storage
        File.uploadedFile(req, res, async function (err) {
            if (err) {
                console.log(err);
            }
            console.log(req.file);
            //only if file exists and it's type is csv save in database
            if (req.file && req.file.mimetype == 'text/csv') {
                var result = await File.create({
                    //saving the path of uploaded file into filename schema
                    fileCsv: req.file.filename,
                    fileName: req.file.originalname + Date.now()
                }).then((file) => {
                    //if created
                    if (file) {
                        return res.redirect('back');
                    }
                }).catch((err) => {
                    //if failed to create
                    console.log(err);
                    return res.status(500).send({ mesage: 'Failed to create file' });
                })

            } else {
                console.log(err);
                return res.status(500).send({ mesage: 'File is empty or wrong extention' });
            }
        })
        return res.status(200);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ mesage: 'Ineternal Server Error' });
    }
};

module.exports.fileView = async (req, res) => {
    try {
        if (req.params.id) {
            //load data of csv file based on the id of the csv
            const results = [];
            const fileDB = await File.findById(req.params.id);

            if (!fileDB) {
                return res.status(404).send({ message: 'File not found' });
            }

            //for finding where is the uploaded file
            const filePath = path.join(__dirname, '..', File.uploadPath, fileDB.fileCsv);
            //creat stream of the csv
            const stream = fs.createReadStream(filePath);

            //creta a promise
            await new Promise((resolve, reject) => {
                stream
                    //call csv function to format the data 
                    .pipe(csv())
                    .on('data', (data) => {
                        //push data into the array 
                        results.push(data);
                    })
                    .on('end', () => {
                        // console.log(results);
                        console.log('CSV parsing completed');
                        //resolve the promise
                        resolve();
                    })
                    .on('error', (err) => {
                        //failed to parse the file
                        console.error('Error parsing CSV:', err);
                        reject(err);
                    });
            });
            //render the file with parsed data
            return res.render('csvView', {
                dataArray: results
            });
        } else {
            return res.status(400).send({ message: 'Incomplete information.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ mesage: 'Ineternal Server Error' });
    }

};