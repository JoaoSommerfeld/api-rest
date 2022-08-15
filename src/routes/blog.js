const express = require('express');
const router = express.Router();
const multer = require('multer');

const blogController = require('../controllers/blogController');

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, './uploads/blog/');
    },
    filename: (req, file, cb) => {
        let data = new Date().toISOString().replace(/:/g, '-') + '-'
        cb(null, data + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
});

router.get('/', blogController.getBlog);
router.post('/add', upload.single('img'), blogController.postBlog);

module.exports = router;