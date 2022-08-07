const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

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

                return res.status(200).send({ response:  resultado });
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

                return res.status(200).send({ response:  resultado });
            }
        )
    }) 
});

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, resultado, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(201).send({
                    mensagem: 'Produto inserico com sucesso',
                    id_produto: resultado.insertId
                });
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
                res.status(202).send({
                    mensagem: 'Alterado com sucesso!'
                });
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

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(202).send({
                    mensagem: 'Removido com sucesso!'
                });
            }
        )
    });
});


module.exports = router;