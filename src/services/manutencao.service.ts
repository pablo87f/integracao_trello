import { Projeto, ListaProjeto, Participante, QuadroManutencao, TrelloLabel } from "../types";
import { listas } from "../dados/_padrao";

var _ = require('lodash')
var moment = require('moment')


var Trello = require("trello")
var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");
// var trello = new Trello("4d302f3977e0313c3d7ae1f27d3500e2", "3a8b8c79d7862f3f586939068c14abecea1cb8a26a1dc61261233831455b22a7");

const etiquetasImportancia = [
    { "id": "5d482237af988c41f27650da", "idBoard": "5d4822377c118d0890031f75", "name": "IMPORTANTE", "color": '#f2d600', },
    { "id": "5d482237af988c41f27650db", "idBoard": "5d4822377c118d0890031f75", "name": "DESEJADO", "color": '#61bd4f', },
    { "id": "5d482237af988c41f27650dd", "idBoard": "5d4822377c118d0890031f75", "name": "IMPRESCINDÍVEL", "color": '#eb5a46', },
]

const etiquetasTipo = [
    { "id": "5dfcdfebd52fa642425498fb", "idBoard": "5d4822377c118d0890031f75", "name": "SUPORTE", "color": '#87CEEB' },
    { "id": "5dfcc37e92f912388124a893", "idBoard": "5d4822377c118d0890031f75", "name": "MELHORIA", "color": '#c377e0', },
    { "id": "5dfa16184b1a1478cb987b0e", "idBoard": "5d4822377c118d0890031f75", "name": "BUG", "color": '#344563', },
    { "id": "5e56aaca1731398179dab35b", "idBoard": "5d4822377c118d0890031f75", "name": "ANÁLISE", "color": '#0079bf', }
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


    export async function processarDadosManutencao(quadroManutencao: QuadroManutencao) {
        const dadosSemana = await extrairDadosManutencao(quadroManutencao)

        let qtdsCardsEtiquetasImportancia = {}

        etiquetasImportancia.map((e) => {
            const cards = _.filter(dadosSemana.cartoes, (cartao: any) => {
                return _.find(cartao.labels, { id: e.id })
            })
            qtdsCardsEtiquetasImportancia = { ...qtdsCardsEtiquetasImportancia, [e.name]: cards.length }
        })

        let qtdsCardsEtiquetasTipo = {}
        etiquetasTipo.map((e) => {
            const cards = _.filter(dadosSemana.cartoes, (cartao: any) => {
                return _.find(cartao.labels, { id: e.id })
            })
            qtdsCardsEtiquetasTipo = { ...qtdsCardsEtiquetasTipo, [e.name]: cards.length }
        })

        let qtdsCardsListas = {}
        dadosSemana.listas.map((list: any) => {
            const cards = _.filter(dadosSemana.cartoes, (cartao: any) => {
                return cartao.list.id === list.id
            })
            qtdsCardsListas = { ...qtdsCardsListas, [list.name]: cards.length }
        })

        const numerosSemanas = Array.from(Array(dadosSemana.numSemanaAtual), (_, i) => i + 1)

        const semanas = numerosSemanas.reverse().map((numSemana) => {
            const inicio = moment().day("Sunday").week(numSemana).format('DD/MM/YY');
            const fim = moment().day("Sunday").week(numSemana).add(6, 'days').format('DD/MM/YY');
            return { numero: numSemana, inicio, fim, desc: `${numSemana} - (${inicio} - ${fim})` }
        })

        // console.log('dadosSemana', dadosSemana, qtdsCardsEtiquetasImportancia, qtdsCardsEtiquetasTipo, qtdsCardsListas)
        return {
            ...dadosSemana,
            qtdsCardsEtiquetasImportancia,
            qtdsCardsEtiquetasTipo,
            qtdsCardsListas,
            etiquetasImportancia,
            etiquetasTipo,
            semanas,
        }

        // salvar dados de manutencao

    }

    export function horasEntreDatas(fim: Date, inicio: Date) {
        const ms = moment(fim, "DD/MM/YYYY HH:mm:ss").diff(moment(inicio, "DD/MM/YYYY HH:mm:ss"));
        const d = moment.duration(ms);
        return Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
    }


    export async function extrairDadosManutencao(quadroManutencao: QuadroManutencao) {

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

        const cartoes = cartoesDemandas.map((c: any) => {
            // pegando dados básicos dos cards
            const { id, name, idList, shortUrl, dateLastActivity } = c
            const list = _.find(listas, { id: idList })
            const dataCriacao = new Date(1000 * parseInt(id.substring(0, 8), 16))
            const dataConclusao = new Date(dateLastActivity)

            const resolution = moment.duration(moment(dataConclusao).diff(moment(dataCriacao)));
            const tempoResolucao = moment.utc(resolution.as('milliseconds')).format('HH:mm')

            const duration = moment.duration(moment().diff(moment(dataCriacao)));
            const tempoDuracao = duration.humanize()
            
            const concluido = list.id === idListaConclusao 




            const labels = c.labels.map((label: TrelloLabel) => {
                const colorName: any = label.color ? label.color : 'grey'
                return { ...label, color: trelloLabelsPalette[colorName] }
            })
            return { id, name, list, shortUrl, labels, dataCriacao, dataConclusao, tempoResolucao, tempoDuracao, concluido }
        })

        const numSemanaAtual = moment().week();
        const dtInicio = moment().day("Sunday").week(numSemanaAtual).toDate();
        const dtFim = moment().day("Sunday").week(numSemanaAtual).add(6, 'days').toDate();

        return { numSemanaAtual, dtInicio, dtFim, cartoes, listas, etiquetas }
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