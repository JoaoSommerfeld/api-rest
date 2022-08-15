const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const produtosController = require('../controllers/produtosController');

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, './uploads/produtos/');
    },
    filename: (req, file, cb) => {
        let data = new Date().toISOString().replace(/:/g, '-') + '-'
        cb(null, data + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
})

router.get('/', produtosController.getProdutos);
router.get('/:id', produtosController.getUmProduto);
router.post('/', login.obrigatorio, upload.single('produto_imagem'), produtosController.postProdutos);
router.patch('/', login.obrigatorio, produtosController.patchProdutos);
router.delete('/', login.obrigatorio, produtosController.deleteProdutos);


module.exports = router;