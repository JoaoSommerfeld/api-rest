const express = require('express');
const router = express.Router();


const usuariosController = require('../controllers/usuariosController');

router.post('/cadastro', usuariosController.postUsuario);
router.post('/login', usuariosController.postLogin);

module.exports = router;