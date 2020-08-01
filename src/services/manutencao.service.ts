import {
    Projeto,
    ListaProjeto,
    Participante,
    QuadroManutencao,
    TrelloLabel,
    DadosGeraisManutencao,
    DadosProcessadosManutencao,
    DadosQuadroManutencaoIntervalo,
    IFiltrosGraficoManutencao,
    IFiltrosDadosGeraisManutencao as IFiltrosCartoesManutencao,
    IFiltrosIntervaloManutencao
} from "../types";
import { listas } from "../dados/_padrao";
import Repositorio from "../repositorio";
import { ArrayUtil } from "../util/array.util";

var _ = require('lodash')
var moment = require('moment')


var Trello = require("trello")
var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");
// var trello = new Trello("4d302f3977e0313c3d7ae1f27d3500e2", "3a8b8c79d7862f3f586939068c14abecea1cb8a26a1dc61261233831455b22a7");

namespace ManutencaoService {

    export const etiquetaIndefinida = { "name": "INDEFINIDO", "color": '#b3bac5', }

    export const etiquetasImportancia = [
        { "name": "IMPORTANTE", "color": '#f2d600', },
        { "name": "DESEJADO", "color": '#61bd4f', },
        { "name": "IMPRESCINDÍVEL", "color": '#eb5a46', },
        { "name": "INDEFINIDO", "color": '#b3bac5', },
    ]

    export const etiquetasTipo = [
        { "name": "SUPORTE", "color": '#87CEEB' },
        { "name": "MELHORIA", "color": '#c377e0', },
        { "name": "BUG", "color": '#344563', },
        { "name": "ANÁLISE", "color": '#0079bf', },
        { "name": "INDEFINIDO", "color": '#b3bac5', },
    ]

    export const idsCardsPadrao = [
        "5dee8e267f5f5f03c197da65",
        "5eea67bcbc3a6f1eaf2befb8",
        "5eea1f7acd50f25486b082ea"
    ]

    export const trelloLabelsPalette: any = {
        'green': '#61bd4f',
        'yellow': '#f2d600',
        'red': '#eb5a46',
        'purple': '#c377e0',
        'blue': '#0079bf',
        'sky': '#00c2e0',
        'black': '#344563',
        'pink': '#ff78cb',
        'lime': '#51e898',
        'orange': '#ff9f1a',
        'grey': '#b3bac5'
    }


    export const bluePalette = [
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#FFC107',
        '#FF9800',
        '#795548',
    ]


    export function converterTempoNumero(tempo: any) {

        let partesTempo = tempo.split(':')
        let horas = parseInt(partesTempo[0])
        let minutos = parseInt(partesTempo[1])

        return horas + (minutos / 60)
    }


    export function processarDadosManutencao(dadosGerais: DadosGeraisManutencao): DadosProcessadosManutencao {

        let qtdsCardsEtiquetasImportancia = {}

        etiquetasImportancia.map((e) => {
            const cards = _.filter(dadosGerais.cartoes, (cartao: any) => {
                return cartao.importancia.name === e.name
            })
            qtdsCardsEtiquetasImportancia = { ...qtdsCardsEtiquetasImportancia, [e.name]: cards.length }
        })

        let qtdsCardsEtiquetasTipo = {}
        etiquetasTipo.map((e) => {
            const cards = _.filter(dadosGerais.cartoes, (cartao: any) => {
                return cartao.tipo.name === e.name
            })
            qtdsCardsEtiquetasTipo = { ...qtdsCardsEtiquetasTipo, [e.name]: cards.length }
        })

        let qtdsCardsListas = {}
        dadosGerais.listas.map((list: any) => {
            const cards = _.filter(dadosGerais.cartoes, (cartao: any) => {
                return cartao.list.id === list.id
            })
            qtdsCardsListas = { ...qtdsCardsListas, [list.name]: cards.length }
        })

        return {
            qtdsCardsEtiquetasImportancia,
            qtdsCardsEtiquetasTipo,
            qtdsCardsListas
        }

    }

    export function somarPorChaves(dados: any, novosDados: any) {
        Object.keys(novosDados).map(k => {
            if (dados[k]) {
                dados[k] += novosDados[k]
            } else {
                dados[k] = novosDados[k]
            }
            return k
        })

        return dados
    }


    export function salvarDadosSemanaisQuadroManutencao(dadosGerais: DadosGeraisManutencao, idQuadro: number) {

        const { numSemana, dtInicio, dtFim } = obtemInfoSemanaAtual()

        const dadosManutencaoIntervalo: DadosQuadroManutencaoIntervalo = {
            numSemana,
            dtInicio,
            dtFim,
            dadosGerais
        }

        const quadro: QuadroManutencao = Repositorio.getItem(`quadro-manutencao.${idQuadro}.json`)

        if (quadro) {
            quadro.dadosManutencao = quadro.dadosManutencao || new Array<DadosQuadroManutencaoIntervalo>()

            const indexSemanaExistente = quadro.dadosManutencao.findIndex(dados => dados.numSemana === numSemana)

            if (indexSemanaExistente < 0) {
                quadro.dadosManutencao.push(dadosManutencaoIntervalo)
            }
            else {
                quadro.dadosManutencao[indexSemanaExistente] = dadosManutencaoIntervalo
            }

            quadro.dataUltimoProcessamento = new Date()

            Repositorio.setItem(`quadro-manutencao.${idQuadro}.json`, quadro)

        }
        else {
            console.log(`"quadro-manutencao.${idQuadro}.json" não encontrado`)
        }

    }

    export function obtemInfoSemanaAtual() {

        const numSemana = moment().week();
        const dtInicio = moment().day("Sunday").week(numSemana).toDate();
        const dtFim = moment().day("Sunday").week(numSemana).add(6, 'days').toDate();

        return {
            numSemana,
            dtInicio,
            dtFim
        }
    }

    export function obtemInfoSemanasIntervalo(numSemanaInicio: number, numSemanaFim: number) {

        let semanas: Array<any> = []
        for (let i = numSemanaInicio; i <= numSemanaFim; i++) {
            const inicio = moment().day("Sunday").week(i).format('DD/MM/YY');
            const fim = moment().day("Sunday").week(i).add(6, 'days').format('DD/MM/YY');
            semanas.push({ numero: i, inicio, fim, desc: `${i} - (${inicio} - ${fim})` })

        }
        return semanas
    }

    export function horasEntreDatas(fim: Date, inicio: Date) {
        const ms = moment(fim, "DD/MM/YYYY HH:mm:ss").diff(moment(inicio, "DD/MM/YYYY HH:mm:ss"));
        const d = moment.duration(ms);
        return Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
    }

    export function extrairDadosCardsManutencao(cartoes: Array<any>, idListaConclusaoQuadro: string | undefined, listas: Array<any>) {
        return cartoes.map((c: any) => {
            // pegando dados básicos dos cards
            const { id, name, idList, shortUrl, dateLastActivity } = c
            const list = _.find(listas, { id: idList })
            const dataCriacao = new Date(1000 * parseInt(id.substring(0, 8), 16))
            const dataConclusao = new Date(dateLastActivity)

            const resolution = moment.duration(moment(dataConclusao).diff(moment(dataCriacao)));
            const tempoResolucao = moment.utc(resolution.as('milliseconds')).format('HH:mm')

            const duration = moment.duration(moment().diff(moment(dataCriacao)));
            const tempoDuracao = duration.humanize()

            const concluido = list.id === idListaConclusaoQuadro

            let importancia = etiquetaIndefinida
            let tipo = etiquetaIndefinida

            const labels = c.labels.map((label: TrelloLabel) => {
                const colorName: any = label.color ? label.color : 'grey'
                const etiqueta = { ...label, color: trelloLabelsPalette[colorName] }
                if (etiquetasImportancia.some(e => e.name === etiqueta.name)) {
                    importancia = etiqueta
                }
                else if (etiquetasTipo.some(e => e.name === etiqueta.name)) {
                    tipo = etiqueta
                }
                return etiqueta
            })
            return { id, name, list, shortUrl, labels, dataCriacao, dataConclusao, tempoResolucao, tempoDuracao, concluido, importancia, tipo }
        })
    }

    export async function extrairDadosGeraisManutencao(quadroManutencao: QuadroManutencao): Promise<DadosGeraisManutencao> {

        const { idBoard, idListaConclusao } = quadroManutencao

        // obter as listas
        const listas = (await trello.getListsOnBoard(idBoard) || []).map((l: any, i: number) => { return { id: l.id, name: l.name, color: bluePalette[i] } })

        // obter os labels
        const etiquetasTrello = await trello.getLabelsForBoard(idBoard)
        const etiquetas = etiquetasTrello.map((e: TrelloLabel) => {
            const nomeCor: any = e.color
            return { id: e.id, name: e.name, color: trelloLabelsPalette[nomeCor] }
        })

        // separar dados dos cards (id, titulo, descricao, data_criacao, data_conclusao, labels, lista)
        const cards = await trello.getCardsOnBoardWithExtraParams(idBoard)

        // retirando os cards padrões do quadro 
        const cartoesDemandas = _.filter(cards, (card: any) => {
            return !_.find(idsCardsPadrao, (id: string) => {
                return id === card.id
            })
        })

        const cartoes = extrairDadosCardsManutencao(cartoesDemandas, idListaConclusao, listas)

        const dados: DadosGeraisManutencao = { cartoes, listas, etiquetas }
        return dados
        // filtrar os cards por listas
        // marcar os cards que foram criados na semana - novos cards
        // calcular quantidade de cards que foram concluidos
        // calcular tempo em horas de cada card em cada etapa 
        // calcular tempo total em horas de cada card entre criacão e conclusão -> quanto que o card foi movido pra concluido 

    }

    export async function arquivarCartoes(cards: Array<any>) {
        for (const c of cards) {
            const res = await trello.makeRequest('PUT', `/1/cards/${c.id}`, { closed: true })
            console.log('id', c.id, 'res', res.status)
        }
    }

    export async function arquivarCartoesIdLista(idLista: String) {
        const cards = await trello.getCardsOnList(idLista)
        await arquivarCartoes(cards)
    }

    export function filtrarDadosManutencaoSemana(
        dadosManutencao: Array<DadosQuadroManutencaoIntervalo>,
        filtros: IFiltrosIntervaloManutencao): Array<DadosQuadroManutencaoIntervalo> {

        const {
            semInicio,
            semFim,
        } = filtros

        if (dadosManutencao && dadosManutencao.length > 0) {
            if (semInicio) {
                dadosManutencao = dadosManutencao.filter(d => d.numSemana >= semInicio)
            }

            if (semFim) {
                dadosManutencao = dadosManutencao.filter(d => d.numSemana <= semFim)
            }
        }

        return dadosManutencao

    }

    export function filtrarCartoesDadosGeraisManutencao(cartoes: Array<any>, filtros: IFiltrosCartoesManutencao): Array<any> {

        const {
            importancias,
            tipos,
            listas
        } = filtros

        return cartoes.filter(c => {

            let deveIrImportancia = true
            let deveIrTipo = true
            let deveIrLista = true

            if (importancias) {
                deveIrImportancia = importancias.split(',').find(i => i === c.importancia.name) != undefined
            }
            if (tipos) {
                deveIrTipo = tipos.split(',').find(t => t === c.tipo.name) != undefined
            }
            if (listas) {
                deveIrLista = listas.split(',').find(l => l === c.list.name) != undefined
            }
            return deveIrImportancia && deveIrTipo && deveIrLista
        })

    }


    // export async function salvarDadosManutencao(dados, idManutencao) {

    // }

    // export async function arquivarCards(cards) {
    //     // processar dados manutenção
    //     // arquivar cards da lista de conclusão
    // }

    // export async function gerarGraficoPizzaImportancia(cards) {

    // }

    // export async function gerarGraficoPizzaTipo(cards) {

    // }

    // export async function gerarGraficoResolucaoPorSemana(dataInicio, dataFim, cards) {

    // }

    // export async function gerarGraficoResolucaoPorMes(dataInicio, dataFim, cards) {

    // }

}

export default ManutencaoService