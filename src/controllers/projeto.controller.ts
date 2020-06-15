import _ from "lodash";
import express from 'express';

import projetos from '../dados/projetos';
import Repositorio from "../repositorio";
import StatusProjetos from "../dados/status-projeto";
import { GraficoService } from "../services";
import { Projeto, ListaProjeto, Participante, Pessoa } from "../types";

import pessoas from "../dados/pessoa";

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

        const { prefixo, nome, dataInicioSprint, idBoard, idsParticipantes, titulosListas, esperadoParticipantes, execucaoListas } = req.body

        if (!prefixo) res.status(400).send({ sucess: false, message: "Campo 'prefíxo' é obrigatório" })
        if (!nome) res.status(400).send({ sucess: false, message: "Campo 'nome' é obrigatório" })
        if (!dataInicioSprint) res.status(400).send({ sucess: false, message: "Campo 'dataInicioSprint' é obrigatório" })
        if (!idBoard) res.status(400).send({ sucess: false, message: "Campo 'idBoard' é obrigatório" })
        if (!idsParticipantes || idsParticipantes.lenght <= 0) res.status(400).send({ sucess: false, message: "Campo 'idsParticipantes' é obrigatório" })
        if (!titulosListas || titulosListas.lenght <= 0) res.status(400).send({ sucess: false, message: "Campo 'titulosListas' é obrigatório" })

        let indexProjetos = Repositorio.getAll('index.projetos.json')

        const idsExistentes = Object.keys(indexProjetos).map(id => parseInt(id))

        const proximoId = Math.max.apply(Math, idsExistentes) + 1

        // monta as listas informadas no formulário
        const listasTrello: Array<ListaProjeto> = titulosListas.map((tituloLista: string, index: number) => {
            return <ListaProjeto>{ titulo: tituloLista, valorExecucao: parseFloat(execucaoListas[index]) }
        })

        const equipeCompleta: Array<Pessoa> = Object.values(pessoas).map(p => <Pessoa>{ id: p.id, nome: p.nome, nomeCompleto: p.nome, user: p.user })

        const participantes: Array<Participante> = idsParticipantes.map((id: string, index: number) => {
            const pessoa = _.find(equipeCompleta, { id: parseInt(id) })
            if (pessoa) { return <Participante>{ pessoa, percentualDiarioEsperado: esperadoParticipantes[index]/100 } }
            throw new Error('Participante não encontrada dentros dos membros cadastrados')
        })

        let projeto: Projeto = {
            id: proximoId,
            prefixo,
            nome,
            dataInicioSprint,
            // dataEntregaSprint, 
            idBoard,
            listasProjeto: listasTrello,  // Array < ListaTrello >
            diasDuracaoSprint: 15,
            participantes: participantes,  // Array < ConfiguracaoFuncionario >
            status: StatusProjetos.ativo,
            versao: '2.0'
        }

        const nomeArquivoProjeto = `projeto.${projeto.id}.json`

        indexProjetos = { ...indexProjetos, [projeto.id]: nomeArquivoProjeto }

        Repositorio.setItem(nomeArquivoProjeto, projeto)
        Repositorio.setItem('index.projetos.json', indexProjetos)

        const membros = Object.values(pessoas)
        return res.render('./projeto/novo.html', {
            membros,
            sucess:true
        })
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