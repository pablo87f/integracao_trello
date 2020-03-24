import _ from "lodash";
import express from 'express';

import projetos from '../dados/projetos';
import Repositorio from "../repositorio";
import StatusProjetos from "../dados/status-projeto";
import { GraficoService } from "../services";

namespace ProjetoController {

    export function index(req: express.Request, res: express.Response) {
        const projetos = Repositorio.getAll(Repositorio.Entities.Projetos)
        return res.render('./home/index.html', {
            'projetos': _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc']),
            'projetos_selecionado': "mm-active"
        })
    }

    export function show(req: express.Request, res: express.Response) {
        if (!req.params.id) res.sendStatus(401);

        let idProjeto: number = 0

        try {
            idProjeto = parseInt(req.params.id);
        }
        catch (e) {
            res.sendStatus(401);
        }

        let projeto = Repositorio.findById(Repositorio.Entities.Projetos, idProjeto)

        if (!projeto) res.sendStatus(404)

        res.render('projeto/index.html', { 'projeto': projeto })
    }

    export function store(req: express.Request, res: express.Response) {

        if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })

        if (!req.body.nome) res.status(400).send({ sucess: false, message: "Campo 'nome' é obrigatório" })

        if (!req.body.codigoQuadroTrello) res.status(400).send({ sucess: false, message: "Campo 'codigoQuadroTrello' é obrigatório" })

        let projeto = {
            nome: req.body.nome,
            idBoard: req.body.codigoQuadroTrello
        }

        Repositorio.insert(Repositorio.Entities.Projetos, projeto)

        res.send({ sucess: true })
    }

    export async function update(req: express.Request, res: express.Response) {

        const { id: idProjeto } = req.params
        console.warn('update projeto', idProjeto)

        const projeto = Repositorio.findById(Repositorio.Entities.Projetos, idProjeto)

        if (!projeto) return res.status(401).send({ error: 'Projeto não encontrado' })

        projeto.status = StatusProjetos.finalizado
        projeto.dataEntregaSprint = new Date()
        projeto.dadosGrafico = await GraficoService.gerarBurningDown(projeto)
        
        await Repositorio.updateById(Repositorio.Entities.Projetos, projeto.id, projeto)

        return res.send({ idProjeto })

    }
}

export default ProjetoController