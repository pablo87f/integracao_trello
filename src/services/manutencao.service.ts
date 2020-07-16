import { Projeto, ListaProjeto, Participante, QuadroManutencao, TrelloLabel, DadosGeraisManutencao, DadosProcessadosManutencao, DadosQuadroManutencaoIntervalo } from "../types";
import { listas } from "../dados/_padrao";
import Repositorio from "../repositorio";

var _ = require('lodash')
var moment = require('moment')


var Trello = require("trello")
var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");
// var trello = new Trello("4d302f3977e0313c3d7ae1f27d3500e2", "3a8b8c79d7862f3f586939068c14abecea1cb8a26a1dc61261233831455b22a7");

const etiquetaIndefinida = { "name": "INDEFINIDO", "color": '#b3bac5', }

const etiquetasImportancia = [
    { "name": "IMPORTANTE", "color": '#f2d600', },
    { "name": "DESEJADO", "color": '#61bd4f', },
    { "name": "IMPRESCINDÍVEL", "color": '#eb5a46', },
    { "name": "INDEFINIDO", "color": '#b3bac5', },
]

const etiquetasTipo = [
    { "name": "SUPORTE", "color": '#87CEEB' },
    { "name": "MELHORIA", "color": '#c377e0', },
    { "name": "BUG", "color": '#344563', },
    { "name": "ANÁLISE", "color": '#0079bf', },
    { "name": "INDEFINIDO", "color": '#b3bac5', },
]

const idsCardsPadrao = [
    "5dee8e267f5f5f03c197da65",
    "5eea67bcbc3a6f1eaf2befb8",
    "5eea1f7acd50f25486b082ea"
]

const trelloLabelsPalette: any = {
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

namespace ManutencaoService {


    export function converterTempoNumero(tempo: any) {

        let partesTempo = tempo.split(':')
        let horas = parseInt(partesTempo[0])
        let minutos = parseInt(partesTempo[1])

        return horas + (minutos / 60)
    }


    export async function processarDadosManutencao(dadosGerais: DadosGeraisManutencao): Promise<DadosProcessadosManutencao> {

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
            qtdsCardsListas,
            etiquetasImportancia,
            etiquetasTipo
        }

    }

    export function salvarDadosSemanaisQuadroManutencao(dadosGerais: DadosGeraisManutencao, dadosProcessados: DadosProcessadosManutencao, idQuadro: number) {

        const { numSemana, dtInicio, dtFim } = obtemInfoSemanaAtual()

        const dadosManutencaoIntervalo: DadosQuadroManutencaoIntervalo = {
            numSemana,
            dtInicio,
            dtFim,
            dadosGerais,
            dadosProcessados
        }

        const quadro: QuadroManutencao = Repositorio.getItem(`quadro-manutencao.${idQuadro}.json`)

        const indexSemanaExistente = quadro.dadosManutencao.findIndex(dados => dados.numSemana === numSemana)

        if (indexSemanaExistente < 0) {
            quadro.dadosManutencao.push(dadosManutencaoIntervalo)
        } 
        else {
            quadro.dadosManutencao[indexSemanaExistente] = dadosManutencaoIntervalo
        }

        Repositorio.setItem(`quadro-manutencao.${idQuadro}.json`, quadro)

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
        const listas = await trello.getListsOnBoard(idBoard)

        // obter os labels
        const etiquetasTrello = await trello.getLabelsForBoard(idBoard)
        const etiquetas = etiquetasTrello.map((e: TrelloLabel) => {
            const nomeCor: any = e.color
            return { ...e, color: trelloLabelsPalette[nomeCor] }
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