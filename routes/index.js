const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/files/' })

const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
router.post('/upload', homeController.uploads);
router.get('/:id/view', homeController.fileView);

module.exports = router;