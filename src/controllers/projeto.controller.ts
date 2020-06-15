import _ from "lodash";
import express from 'express';

import projetos from '../dados/projetos';
import Repositorio from "../repositorio";
import StatusProjetos from "../dados/status-projeto";
import { GraficoService } from "../services";
import { Projeto } from "../types";

namespace ProjetoController {

    export async function index(req: express.Request, res: express.Response) {
        const indexProjetos = Repositorio.getAll('index.projetos.json')
        const projetosPromisses = Object.values(indexProjetos).map((arquivoProjeto) => {
            return Repositorio.getItem(arquivoProjeto)
        })

        const projetos = await Promise.all(projetosPromisses)

        const projetosOrdenados = _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc'])

        return res.render('./home/index.html', {
            'projetos': projetosOrdenados,
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

        const nomeArquivo = `projeto.${idProjeto}.json`

        const projeto = Repositorio.getItem(nomeArquivo)

        if (!projeto) res.sendStatus(404)

        res.render('projeto/index.html', { 'projeto': projeto })
    }

    export function store(req: express.Request, res: express.Response) {

        if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })

        if (!req.body.nome) res.status(400).send({ sucess: false, message: "Campo 'nome' é obrigatório" })

        if (!req.body.codigoQuadroTrello) res.status(400).send({ sucess: false, message: "Campo 'codigoQuadroTrello' é obrigatório" })

        let indexProjetos = Repositorio.getItem('index.projetos.json')

        const idsExistentes = Object.keys(indexProjetos).map(id => parseInt(id))

        let projeto: Projeto = {
            ...req.body
        }

        projeto.id = Math.max.apply(Math, idsExistentes) + 1

        const nomeArquivo = `projeto.${projeto.id}.json`

        indexProjetos = { ...indexProjetos, [projeto.id]: nomeArquivo }

        Repositorio.setItem(nomeArquivo, projeto)

        res.send({ sucess: true })
    }

    export async function update(req: express.Request, res: express.Response) {

        const { id: idProjeto } = req.params
        console.warn('update projeto', idProjeto)

        const nomeArquivo = `projeto.${idProjeto}.json`

        const projeto = Repositorio.getItem(nomeArquivo)

        if (!projeto) return res.status(401).send({ error: 'Projeto não encontrado' })

        projeto.status = StatusProjetos.finalizado
        projeto.dataEntregaSprint = new Date()
        projeto.dadosGrafico = await GraficoService.gerarBurningDown(projeto)

        await Repositorio.setItem(nomeArquivo, projeto)

        return res.send({ idProjeto })

    }
}

export default ProjetoController