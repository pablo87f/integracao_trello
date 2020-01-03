import _ from "lodash";
import express from 'express';
import repo from '../repositorio';

import projetos from '../dados/projetos';

namespace ProjetoController {

    export function listar(req: express.Request, res: express.Response) {
        res.render('./home/index.html', {
            'projetosSalvos': _.orderBy(repo.getAll(repo.Entities.Projetos), ['status.id', 'id'], ['asc', 'desc']),
            'projetos': _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc'])
        })
    }

    export function listar2(req: express.Request, res: express.Response) {
        res.render('home/index.html', { 'projetosSalvos': _.orderBy(repo.getAll(repo.Entities.Projetos), ['status.id', 'id'], ['asc', 'desc']), 'projetos': _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc']) })
    }

    export function detalheProjeto(req: express.Request, res: express.Response) {
        if (!req.params.id) res.sendStatus(401);

        let idProjeto: number = 0

        try {
            idProjeto = parseInt(req.params.id);
        }
        catch (e) {
            res.sendStatus(401);
        }

        let projeto = _.find(projetos, { id: idProjeto })

        if (!projeto) res.sendStatus(404)

        res.render('projeto/index.html', { 'projeto': projeto })
    }

    export function criar(req: express.Request, res: express.Response) {

        if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })

        if (!req.body.nome) res.status(400).send({ sucess: false, message: "Campo 'nome' é obrigatório" })

        if (!req.body.codigoQuadroTrello) res.status(400).send({ sucess: false, message: "Campo 'codigoQuadroTrello' é obrigatório" })

        let projeto = {
            nome: req.body.nome,
            idBoard: req.body.codigoQuadroTrello
        }

        repo.insert(repo.Entities.Projetos, projeto)

        res.send({ sucess: true })
    }

    export function listarFuncionalidades(req: express.Request, res: express.Response) {

        if (!req.params.id) res.sendStatus(401);
    
        let idProjeto: number = 0
    
        try {
            idProjeto = parseInt(req.params.id);
        }
        catch (e) {
            res.sendStatus(401);
        }
    
        let projeto = _.find(projetos, { id: idProjeto })
    
        if (!projeto) res.sendStatus(404)
    
        const funcionalidades = repo.getAll(repo.Entities.Funcionalidades) || []
    
        res.render('projeto/funcionalidades.html', { 'projeto': projeto, 'funcionalidades': _.orderBy(funcionalidades, ['id'], ['desc']) })
    }

    export function recuperarProjetos(req: express.Request, res: express.Response) {
        res.send(projetos)
    }
}

export default ProjetoController