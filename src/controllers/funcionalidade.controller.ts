import _ from "lodash";
import express from 'express';
import repo from '../repositorio';

namespace FuncionalidadeController {
    export function criar(req: express.Request, res: express.Response) {

        if (!req.params.id) res.sendStatus(401);
    
        let idProjeto: number = 0
    
        try {
            idProjeto = parseInt(req.params.id);
        }
        catch (e) {
            res.sendStatus(401);
        }
    
        if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })
    
        if (!req.body.descricao) res.status(400).send({ sucess: false, message: "Campo 'descricao' é obrigatório" })
    
        let funcionalidade = {
            descricao: req.body.descricao
        }
    
        repo.insert(repo.Entities.Funcionalidades, funcionalidade)
    
        res.send({ sucess: true })
    }
}

export default FuncionalidadeController