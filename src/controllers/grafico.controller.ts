

import express from 'express';
import _ from "lodash";

var _feriados = require('../dados/_feriados')

// import projetos from '../dados/projetos';
import path from 'path';
import { GraficoService } from "../services";
import Repositorio from '../repositorio';
import DadosGrafico from '../grafico';
import ManutencaoService from '../services/manutencao.service';
import { QuadroManutencao, DadosProcessadosManutencao, DadosGeraisManutencao } from '../types';

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
    function removeDuplicates(myArr: Array<any>, prop: any) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }
    interface IFiltrosManutencao {
        semInicio?: Number
        semFim?: Number
        importancia?: String
        tipo?: String
    }

    export async function gerarGraficoManutencao(req: express.Request, res: express.Response) {

        let idQuadro = req.params.id_quadro

        const semanaAtual = ManutencaoService.obtemInfoSemanaAtual()
        const filtros: IFiltrosManutencao = req.query

        const {
            semInicio = semanaAtual.numSemana,
            semFim = semanaAtual.numSemana,
            importancia,
            tipo,
            lista
        } = filtros

        let dtInicio = semanaAtual.dtInicio
        let dtFim = semanaAtual.dtFim

        const nomeArquivo = `quadro-manutencao.${idQuadro}.json`

        const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivo)

        if (!quadro) return res.status(401).send({ error: 'Projeto não encontrado' })

        try {

            if (quadro && quadro.dadosManutencao && quadro.dadosManutencao.length > 0) {

                let dadosManutencao = quadro.dadosManutencao
                if (semInicio) {
                    dadosManutencao = dadosManutencao.filter(d => d.numSemana >= semInicio)
                }

                if (semFim) {
                    dadosManutencao = dadosManutencao.filter(d => d.numSemana <= semFim)
                }


                let dadosGerais: DadosGeraisManutencao = { cartoes: [], listas: [], etiquetas: [] }

                for (const dados of dadosManutencao) {

                    dtInicio = dados.dtInicio < dtInicio ? dados.dtInicio : dtInicio
                    dtFim = dados.dtFim < dtFim ? dados.dtFim : dtFim

                    dadosGerais.cartoes = dadosGerais.cartoes.concat(
                        dados.dadosGerais.cartoes.filter(c => {
                            
                            let deveIrImportancia = true
                            let deveIrTipo = true

                            if (importancia) {
                                const importancias = importancia.split(',')
                                deveIrImportancia = importancias.find(i => i === c.importancia.name) != undefined
                            }
                            if (tipo) {
                                const tipos = tipo.split(',')
                                deveIrTipo = tipos.find(t => t === c.tipo.name) != undefined
                            }
                            return deveIrImportancia && deveIrTipo
                        })
                    )

                    dadosGerais.listas = dadosGerais.listas.concat(dados.dadosGerais.listas)
                    dadosGerais.etiquetas = dadosGerais.etiquetas.concat(dados.dadosGerais.etiquetas)
                }

                dadosGerais.listas = removeDuplicates(dadosGerais.listas, 'name')
                dadosGerais.etiquetas = removeDuplicates(dadosGerais.etiquetas, 'name')

                const { numSemana } = quadro.dadosManutencao[quadro.dadosManutencao.length - 1]




                const dadosProcessados: DadosProcessadosManutencao = await ManutencaoService.processarDadosManutencao(dadosGerais)

                const semanaAtual = ManutencaoService.obtemInfoSemanaAtual()
                const semanas = ManutencaoService.obtemInfoSemanasIntervalo(1, semanaAtual.numSemana)

                return res.send({ dtInicio, dtFim, numSemana, ...dadosGerais, ...dadosProcessados, semanas })

            }
            return res.send({ message: "Sem dados processados" })


        } catch (e) {
            console.warn('erro:', e, e.message)
            res.send('Falha ao executar')
        }
    }

}

export default GraficoController