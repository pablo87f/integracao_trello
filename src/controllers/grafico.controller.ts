

import express from 'express';
import _ from "lodash";

var _feriados = require('../dados/_feriados')

// import projetos from '../dados/projetos';
import path from 'path';
import { GraficoService } from "../services";
import Repositorio from '../repositorio';
import DadosGrafico from '../grafico';
import ManutencaoService from '../services/manutencao.service';
import { QuadroManutencao, DadosProcessadosManutencao, DadosGeraisManutencao, IFiltrosGraficoManutencao, IFiltrosDadosGeraisManutencao, IFiltrosIntervaloManutencao } from '../types';
import { ArrayUtil } from '../util/array.util';

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

        const semanaAtual = ManutencaoService.obtemInfoSemanaAtual()
        const filtros: IFiltrosGraficoManutencao = req.query

        const nomeArquivo = `quadro-manutencao.${idQuadro}.json`

        const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivo)

        const minSemanaDados = Math.min.apply(Math, quadro.dadosManutencao.map(function (d) {
            return d.numSemana
        }));

        const maxSemanaDados = Math.max.apply(Math, quadro.dadosManutencao.map(function (d) {
            return d.numSemana
        }));

        const semanas = ManutencaoService.obtemInfoSemanasIntervalo(minSemanaDados, semanaAtual.numSemana)

        const {
            semInicio = minSemanaDados,
            semFim = maxSemanaDados,
            importancia,
            tipo,
            lista
        } = filtros

        let dtInicioGeral = semanaAtual.dtInicio
        let dtFimGeral = semanaAtual.dtFim
        let numSemanaMin = maxSemanaDados
        let numSemanaMax = minSemanaDados

        if (!quadro) return res.status(401).send({ error: 'Projeto não encontrado' })

        try {

            // filtra os dados gerais do quadro para as semanas informadas
            const dadosManutencaoSemanasFiltrados = ManutencaoService.filtrarDadosManutencaoSemana(quadro.dadosManutencao, {
                semFim,
                semInicio
            })

            if (dadosManutencaoSemanasFiltrados.length > 0) {

                // inicializa os objetos gerais de retorno 
                let dadosGerais: DadosGeraisManutencao = { cartoes: [], listas: [], etiquetas: [] }
                let dadosProcessados: DadosProcessadosManutencao = {
                    qtdsCardsListas: {},
                    qtdsCardsEtiquetasTipo: {},
                    qtdsCardsEtiquetasImportancia: {},
                }

                // percorre os dados gerais filtrados 
                const dadosManutencaoCartoesFiltrados = dadosManutencaoSemanasFiltrados.map((dadosSemana) => {
                    const {
                        dtInicio: dtInicioSemana,
                        dtFim: dtFimSemana,
                        numSemana
                    } = dadosSemana

                    // logica para identificar intervalo de datas incial e final das semanas selecionadas
                    dtInicioGeral = dtInicioSemana < dtInicioGeral ? dtInicioSemana : dtInicioGeral
                    dtFimGeral = dtFimSemana > dtFimGeral ? dtFimSemana : dtFimGeral
                    numSemanaMin = Math.min(numSemanaMin, numSemana)
                    numSemanaMax = Math.max(numSemanaMax, numSemana)

                    // filtra os cartõe por impotancias, tipos e listas
                    dadosSemana.dadosGerais.cartoes = ManutencaoService.filtrarCartoesDadosGeraisManutencao(
                        dadosSemana.dadosGerais.cartoes,
                        {
                            importancias: importancia,
                            tipos: tipo,
                            listas: lista
                        }
                    )

                    // juntando os dados gerais de todas as semanas
                    dadosGerais.cartoes = dadosGerais.cartoes.concat(dadosSemana.dadosGerais.cartoes)
                    dadosGerais.listas = dadosGerais.listas.concat(dadosSemana.dadosGerais.listas)
                    dadosGerais.etiquetas = dadosGerais.etiquetas.concat(dadosSemana.dadosGerais.etiquetas)

                    // processando os dados 

                    return dadosSemana
                })

                dadosGerais.listas = ArrayUtil.removeDuplicates(dadosGerais.listas, 'name')
                dadosGerais.etiquetas = ArrayUtil.removeDuplicates(dadosGerais.etiquetas, 'name')

                let semanasFiltradas: Array<any> = []
                let qtdsSemanaCardsImportancia: any = {}
                let qtdsSemanaCardsTipo: any = {}
                let qtdsSemanaCardsLista: any = {}

                const dadosProcessadoSemanas = dadosManutencaoCartoesFiltrados.map((dadosManutencao) => {
                    const processadosSemana = ManutencaoService.processarDadosManutencao(dadosManutencao.dadosGerais)

                    semanasFiltradas.push(dadosManutencao.numSemana)

                    Object.keys(processadosSemana.qtdsCardsEtiquetasImportancia).map((k) => {
                        const data: Array<any> = qtdsSemanaCardsImportancia[k] || []
                        return qtdsSemanaCardsImportancia[k] = data.concat([{ x: dadosManutencao.numSemana, y: processadosSemana.qtdsCardsEtiquetasImportancia[k] }])
                    })

                    Object.keys(processadosSemana.qtdsCardsEtiquetasTipo).map((k) => {
                        const data: Array<any> = qtdsSemanaCardsTipo[k] || []
                        return qtdsSemanaCardsTipo[k] = data.concat([{ x: dadosManutencao.numSemana, y: processadosSemana.qtdsCardsEtiquetasTipo[k] }])
                    })

                    Object.keys(processadosSemana.qtdsCardsListas).map((k) => {
                        const data: Array<any> = qtdsSemanaCardsLista[k] || []
                        return qtdsSemanaCardsLista[k] = data.concat([{ x: dadosManutencao.numSemana, y: processadosSemana.qtdsCardsListas[k] }])
                    })


                    dadosProcessados.qtdsCardsEtiquetasImportancia = ManutencaoService.somarPorChaves(
                        dadosProcessados.qtdsCardsEtiquetasImportancia,
                        processadosSemana.qtdsCardsEtiquetasImportancia
                    )

                    dadosProcessados.qtdsCardsEtiquetasTipo = ManutencaoService.somarPorChaves(
                        dadosProcessados.qtdsCardsEtiquetasTipo,
                        processadosSemana.qtdsCardsEtiquetasTipo
                    )

                    dadosProcessados.qtdsCardsListas = ManutencaoService.somarPorChaves(
                        dadosProcessados.qtdsCardsListas,
                        processadosSemana.qtdsCardsListas
                    )

                    return processadosSemana
                })

                const numSemana = numSemanaMin != numSemanaMax ? `${numSemanaMin} - ${numSemanaMax}` : `${numSemanaMax}`

                return res.send({
                    dtInicio: dtInicioGeral, dtFim: dtFimGeral, numSemana,
                    ...dadosGerais,
                    ...dadosProcessados,
                    qtdsSemanaCardsImportancia,
                    qtdsSemanaCardsTipo,
                    qtdsSemanaCardsLista,
                    semanasFiltradas,
                    semanas,
                    etiquetasImportancia: ManutencaoService.etiquetasImportancia,
                    etiquetasTipo: ManutencaoService.etiquetasTipo
                })

            } else {

                return res.send({ message: "Sem dados processados" })
            }

        } catch (e) {
            console.warn('erro:', e, e.message)
            res.send('Falha ao executar')
        }
    }

}

export default GraficoController