import { Projeto, ListaProjeto, Participante, QuadroManutencao } from "../types";

var _ = require('lodash')
var moment = require('moment')
var Trello = require("trello")
// var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");
var trello = new Trello("4d302f3977e0313c3d7ae1f27d3500e2", "3a8b8c79d7862f3f586939068c14abecea1cb8a26a1dc61261233831455b22a7");


namespace ManutencaoService {


    export function converterTempoNumero(tempo: any) {

        let partesTempo = tempo.split(':')
        let horas = parseInt(partesTempo[0])
        let minutos = parseInt(partesTempo[1])

        return horas + (minutos / 60)
    }


    export async function processarDadosManutencao() {
        // extrair dados de manutencao
        // salvar dados de manutencao

    }


    export async function extrairDadosManutencao(quadroManutencao: QuadroManutencao) {
        
        const { idBoard } = quadroManutencao

        // obter as listas
        const listas = await trello.getListsOnBoard(idBoard)

        // obter os labels
        const etiquetas = await trello.getLabelsForBoard(idBoard)

        // separar dados dos cards (id, titulo, descricao, data_criacao, labels, lista)
        const cards = await trello.getCardsOnBoard(idBoard)

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