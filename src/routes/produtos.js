const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, './uploads/');
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

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }
                const response = {
                    quantidade: resultado.length,
                    produtosItem: resultado.map(produto => {
                        return {
                            id: produto.id,
                            nome: produto.nome,
                            preco: produto.preco,
                            imagem: produto.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico',
                                url: process.env.URL_PRODUTOS + produto.id
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }            
        )
    });
});

router.get('/:id', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM produtos WHERE id = ?;',
            [req.params.id],
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }
                if(resultado == 0) {
                    return res.status(404).send({
                        mensagem: 'Produto não encontrado com este ID'
                    })
                }
                const response = {
                    produto: {
                        id: resultado[0].id,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        imagem: resultado[0].imagem_produto, 
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos cadastrados',
                            url: process.env.URL_PRODUTOS
                        }                       
                    }
                }
                return res.status(200).send(response);
            }
        )
    }) 
});

router.post('/', upload.single('produto_imagem'), (req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, resultado, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id: resultado.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem: req.file.path,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: process.env.URL_PRODUTOS
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
    
});


router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `UPDATE produtos 
            SET nome = ?,
                preco= ?
            WHERE id = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.id
            ],
            (error, resultado, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Produto alterado com sucesso.',
                    produtoAtualizado: {
                        id: req.body.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'PACH',
                            descricao: 'Retorna os detalhes de um produto específico.',
                            url: process.env.URL_PRODUTOS + req.body.id
                        }
                    }                   
                }
                return res.status(202).send(response); 
            }
        )
    });
});

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `DELETE FROM produtos WHERE id = ?`,
            [req.body.id],
            (error, resultado, fields) => {
                conn.release();

                console.log('resultado', resultado)

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: process.env.URL_PRODUTOS
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
});


module.exports = router;