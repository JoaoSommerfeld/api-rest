const mysql = require('../database/mysql').pool;

exports.getBlog = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM blog;',
            (error, resultado, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                const response = {
                    quantidadePost: resultado.length,
                    postItem: resultado.map(itemPost => {
                        return {
                            id: itemPost.id_post,
                            titulo: itemPost.titulo,
                            subtitulo: itemPost.subtitulo, 
                            data: itemPost.data, 
                            texto: itemPost.texto,
                            img: itemPost.img
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )

    }) 
}

exports.postBlog = (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            `INSERT INTO blog (titulo, subtitulo, data, texto, img) VALUES (?,?,?,?,?)`,
            [
                req.body.titulo,
                req.body.subtitulo,
                req.body.data,
                req.body.texto,
                req.file.path
            ],
            (error, resultado, fields) => {
                conn.release()

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    postCriado: {
                        id_post: resultado.insertId,
                        titulo: req.body.titulo,
                        subtitulo: req.body.subtitulo,
                        data: req.body.data,
                        img: req.file.path,
                        texto: req.body.texto
                    }
                }

                return res.status(200).send(response)
            }
        )
    })
}