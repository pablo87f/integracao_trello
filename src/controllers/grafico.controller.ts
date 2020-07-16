

import express from 'express';
import _ from "lodash";

var _feriados = require('../dados/_feriados')

// import projetos from '../dados/projetos';
import path from 'path';
import { GraficoService } from "../services";
import Repositorio from '../repositorio';
import DadosGrafico from '../grafico';
import ManutencaoService from '../services/manutencao.service';
import { QuadroManutencao } from '../types';

namespace GraficoController {

    export function mostrar(req: express.Request, res: express.Response) {
        res.sendFile(path.join(__dirname + '/views/grafico.view.html'));
    }

    export async function gerarGraficoProjeto(req: express.Request, res: express.Response) {
        let idProjeto = req.params.id_projeto

        const nomeArquivo = `projeto.${idProjeto}.json`

        const projeto = Repositorio.getItem(nomeArquivo)

        if (!projeto) return res.status(401).send({ error: 'Projeto não encontrado' })

        try {

            const nomeProjeto = projeto ? projeto.nome : "---"
            let dadosGrafico = {}

            if (projeto.status.nome == 'ativo') {
                dadosGrafico = await GraficoService.gerarBurningDown(projeto)
            }
            else {
                dadosGrafico = projeto.dadosGrafico
            }

            res.send({ ...dadosGrafico, nomeProjeto })

        } catch (e) {
            console.warn('erro:', e, e.message)
            res.send('Falha ao executar')
        }
    }

    export async function gerarGraficoManutencao(req: express.Request, res: express.Response) {

        let idQuadro = req.params.id_quadro

        const nomeArquivo = `quadro-manutencao.${idQuadro}.json`

        const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivo)

        if (!quadro) return res.status(401).send({ error: 'Projeto não encontrado' })

        try {

            // recuperar do quadro
            const dadosGrafico = quadro.dadosManutencao[0]
            if(dadosGrafico){
                const { dadosGerais, dadosProcessados, dtInicio, dtFim, numSemana } = dadosGrafico
                const semanaAtual = ManutencaoService.obtemInfoSemanaAtual()
                const semanas = ManutencaoService.obtemInfoSemanasIntervalo(1, semanaAtual.numSemana)

                return res.send({  dtInicio, dtFim, numSemana , ...dadosGerais, ...dadosProcessados, semanas })

            }
            return res.send({ message: "Sem dados processados" })


        } catch (e) {
            console.warn('erro:', e, e.message)
            res.send('Falha ao executar')
        }
    }

}

export default GraficoController