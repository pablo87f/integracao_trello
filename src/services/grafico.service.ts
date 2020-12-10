import { Projeto, ListaProjeto, Participante } from "../types";

var _ = require('lodash')
var moment = require('moment')
var _feriados = require('../dados/_feriados')
var Trello = require("trello")
// var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");
var trello = new Trello("4d302f3977e0313c3d7ae1f27d3500e2", "151488604143aef632497ba3cbde4b04255a1f437aa95dca1b8dffc0bbc6ddb8");
//3a8b8c79d7862f3f586939068c14abecea1cb8a26a1dc61261233831455b22a7
// 151488604143aef632497ba3cbde4b04255a1f437aa95dca1b8dffc0bbc6ddb8


namespace GraficoService {

    const cargaHorariaSemanal: any = {
        '1': 0,
        '2': 7,
        '3': 7,
        '4': 7,
        '5': 7,
        '6': 7,
        '7': 0,
    }

    export async function imprimirMembrosDoQuadro(idQuadro: string) {

        let membros = await trello.getBoardMembers(idQuadro)

        console.warn('Qdt membros no quadro: ', membros.length)
        for (let membro of membros) {
            console.warn('membro:', membro)
        }
    }

    export function imprimirColecao(colecao: Array<any>) {
        console.warn(colecao ? 'Qdt itens na coleção: ' + colecao.length : 'Colecao:' + colecao)
        for (let item of colecao) {
            console.warn('item:', item)
        }
    }

    export async function associarInfoListaProjeto(listasQuadro: Array<any>, listasProjeto: Array<ListaProjeto>) {
        let dadosListasProjeto: Array<ListaProjeto> = []

        // identificar id's das listas dos boards
        for (const listaQuadro of listasQuadro) {
            for (const listaProjeto of listasProjeto) {
                if (listaQuadro.name == listaProjeto.titulo) {
                    dadosListasProjeto.push({ ...listaProjeto, listaQuadro: listaQuadro })
                }
            }
        }

        return dadosListasProjeto
    }

    export async function extrairInfoCardsPadraoTitulo(cards: Array<any>) {

        let dadosCards = []

        for (let card of cards) {

            const dadosTituloCard = card.name.split('-')

            // se a descricao está no padrão
            if (dadosTituloCard.length == 4) {

                const dados = {
                    prefixo: dadosTituloCard[0].trim().replace('[', '').replace(']', ''),
                    modulo: dadosTituloCard[1].trim().replace('[', '').replace(']', ''),
                    descricao: dadosTituloCard[2].trim(),
                    tempoEstimado: dadosTituloCard[3].trim().replace('[', '').replace(']', ''),
                    ...card
                }

                dadosCards.push(dados)
            }
        }

        return dadosCards
    }

    export async function recuperarMovimentacoesExecucao(cards: Array<any>, listasExecucao: Array<ListaProjeto>) {

        let movimentacoesExecucao = []

        for (let card of cards) {

            const actions = await trello.makeRequest('GET', '/1/cards/' + card.shortLink + '/actions', { display: true })

            let movimentacoes = []
            for (let action of actions) {
                if (action.display
                    && action.display.translationKey
                    && action.display.translationKey == 'action_move_card_from_list_to_list') {
                    movimentacoes.push(action)
                }
            }

            movimentacoes = _.orderBy(movimentacoes, ['date'], ['desc'])

            // imprimirColecao(movimentacoes)



            for (var listaProjeto of listasExecucao) {
                for (var movimentacao of movimentacoes) {
                    if (listaProjeto.listaQuadro.id == movimentacao.data.listAfter.id) {
                        movimentacoesExecucao.push({
                            idMovi: movimentacao.id,
                            dateMovi: movimentacao.date,
                            moviListAfter: movimentacao.data.listAfter,
                            lista: listaProjeto,
                            card: {
                                id: card.id,
                                dateLastActivity: card.dateLastActivity,
                                prefixo: card.prefixo,
                                modulo: card.modulo,
                                descricao: card.descricao,
                                tempoEstimado: card.tempoEstimado
                            }
                        })
                        break
                    }
                }
            }
        }

        return movimentacoesExecucao
    }

    export async function calculaEsforcoTotalEstimado(infoCards: any, listasProjeto: Array<ListaProjeto>) {

        let tempoBase = moment('00:00:00', 'HH:mm:ss')
        let tempoEstimado = tempoBase.clone()

        for (var info of infoCards) {
            let partesTempoEstimado = info.tempoEstimado.split(':')
            if (partesTempoEstimado.length > 0) { tempoEstimado.add(partesTempoEstimado[0], 'hours') }
            if (partesTempoEstimado.length > 1) { tempoEstimado.add(partesTempoEstimado[1], 'minutes') }

        }

        let totalFatorExecucao = _.sum(listasProjeto.map(l => l.valorExecucao))

        let minutos = tempoEstimado.diff(tempoBase, 'minutes')

        return (minutos / 60) * totalFatorExecucao
    }

    export function converterTempoNumero(tempo: any) {

        let partesTempo = tempo.split(':')
        let horas = parseInt(partesTempo[0])
        let minutos = parseInt(partesTempo[1])

        return horas + (minutos / 60)
    }

    export async function recuperaDiasPassadosStrint(diaInicial: any) {
        const diaInicioSprint = moment(diaInicial, 'YYYY-MM-DD')
        const ontem = moment().add(-1, 'days')
        const qtdeDias = ontem.diff(diaInicioSprint, 'days')

        let diasSprint = []

        for (var i = 0; i <= qtdeDias; i++) {
            let data = diaInicioSprint.clone()
            diasSprint.push(data.add(i, 'days'))
        }

        return diasSprint
    }

    export async function processarCards(cards: any) {

        // extrai informações dos titulos do cards
        const infoCardsProjeto = await extrairInfoCardsPadraoTitulo(cards)

        return infoCardsProjeto

    }

    export async function calcularTempoExecutadoDia(dia: any, movimentacoesExecuxao: any, totalDiasAnteriores: number = 0) {

        let tempoExecutadoDia = totalDiasAnteriores

        for (var movi of movimentacoesExecuxao) {


            if (movi.dateMovi
                && moment(movi.dateMovi).format('YYYY-MM-DD') == moment(dia).format('YYYY-MM-DD')) {
                let tempoExecutadoCard = converterTempoNumero(movi.card.tempoEstimado) * movi.lista.valorExecucao //configuracaoCalculoTempoExecucao[movi.lista.tipoLista]
                tempoExecutadoDia += tempoExecutadoCard
            }
        }

        return tempoExecutadoDia

    }

    export async function filtrarListasExecucao(listas: any, nomesListas: any, tiposListaExecucao: any) {

        let nomesListaExecucao = []
        for (let tipo of tiposListaExecucao) {
            nomesListaExecucao.push(nomesListas[tipo])
        }

        let listasExecucao = []
        for (let nome of nomesListaExecucao) {
            let listaExecucao = _.find(listas, { name: nome })
            if (listaExecucao) {
                listasExecucao.push(listaExecucao)
            }
        }

        return listasExecucao
    }

    export async function filtrarCardsExecucao(cards: any, listasExecucao: Array<ListaProjeto>) {
        let cardsExecucao = []

        for (var lista of listasExecucao) {
            for (var card of cards) {
                if (card.idList == lista.listaQuadro.id) {
                    cardsExecucao.push({ ...card, lista: lista })
                }
            }
        }

        return cardsExecucao
    }

    export async function calculaHorasEsperadasDiaSemana(dia: any, participantes: Array<Participante>) {

        let eh_feriado = _feriados[dia.format('DD/MM/YYYY')]
        if (eh_feriado) return 0

        // obtem o dia da semana
        let diaSemana = dia.day() + 1

        let qtdeHorasEsperadasDia = 0

        for (let participante of participantes) {
            if (participante) {
                let cargaDia = cargaHorariaSemanal[diaSemana]
                let percentProdutivoEsperadoDia = participante.percentualDiarioEsperado
                qtdeHorasEsperadasDia += (cargaDia * percentProdutivoEsperadoDia)
            }
        }

        return qtdeHorasEsperadasDia
    }

    export function obtemFatorDiaSemana(dia: any, participantes: Array<Participante>) {

        let eh_feriado = _feriados[dia.format('DD/MM/YYYY')]
        if (eh_feriado) return 0

        // obtem o dia da semana
        let diaSemana: number = parseInt(dia.day() + 1)

        let fatorEsperadoEquipeDia = 0

        for (let participante of participantes) {
            if (participante) {
                fatorEsperadoEquipeDia += (cargaHorariaSemanal[diaSemana] > 0 ? 1 : 0)
            }
        }

        return participantes.length > 0 ? fatorEsperadoEquipeDia / participantes.length : 0
    }

    export async function gerarBurningDown(projeto: Projeto) {

        let dataInicioSprint, dataFimSprint, dataFimRitmo = null, dataFimTendencia = null
        // recuperar todos os cards do board 
        let cards = await trello.getCardsOnBoard(projeto.idBoard)

        if(cards == "unauthorized permission requested") {
            console.log('NÃO AUTORIZADO PELO TRELLO')
        }
        // recuperar os cards do board 
        let cardsProcessados = await processarCards(cards)

        cardsProcessados = _.filter(cardsProcessados, (card: any) => _.startsWith(card.prefixo, projeto.prefixo))

        const tempoEsforcoTotalEstimado = await calculaEsforcoTotalEstimado(cardsProcessados, projeto.listasProjeto)

        // recuperar listas do board
        const listasQuadro = await trello.getListsOnBoard(projeto.idBoard)

        const dadosListasProjeto = await associarInfoListaProjeto(listasQuadro, projeto.listasProjeto)

        // const listasExecucao = await filtrarListasExecucao(dadosListasProjeto, projeto.nomesListas, Object.keys(projeto.configuracaoCalculoTempoExecucao))
        const listasExecucao = dadosListasProjeto.filter(lista => lista.valorExecucao > 0)

        // recuperar cards de execucao
        const cardsExecucao = await filtrarCardsExecucao(cardsProcessados, listasExecucao)

        const movimentacoesExecuxao = await recuperarMovimentacoesExecucao(cardsExecucao, listasExecucao)

        // processa os dias da sprint
        let diasSprint = await recuperaDiasPassadosStrint(projeto.dataInicioSprint)

        // calcula o tempo executado do dia pela posição dos cards nas listas

        let restante = []
        let executado = []
        let meta = []

        let totalJaExecutadoSprint = 0
        let qtdeRelativaDiasTrabalhadosSprint = 0

        for (var dia of diasSprint) {

            let totalExecutadoDia = await calcularTempoExecutadoDia(dia, movimentacoesExecuxao, totalJaExecutadoSprint)

            totalJaExecutadoSprint = totalExecutadoDia
            restante.push({ t: dia, y: tempoEsforcoTotalEstimado - totalExecutadoDia })
            executado.push({ t: dia, y: totalExecutadoDia })

            let fatorDiaSemana = obtemFatorDiaSemana(dia, projeto.participantes)
            qtdeRelativaDiasTrabalhadosSprint += fatorDiaSemana
        }

        let mediaExecutadoDiaSprint = totalJaExecutadoSprint / qtdeRelativaDiasTrabalhadosSprint

        let tempoRestanteRitmo = tempoEsforcoTotalEstimado
        let diaInicioSprint = moment(projeto.dataInicioSprint, 'YYYY-MM-DD')
        dataInicioSprint = diaInicioSprint
        dataFimSprint = dataInicioSprint.clone().add(projeto.diasDuracaoSprint, 'days')

        let diaRitmo = diaInicioSprint.clone()

        let ritmo = []
        let tendencia = []

        let ontem = moment(moment().add(-1, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD')

        let totalRestanteTendencia = tempoEsforcoTotalEstimado - totalJaExecutadoSprint

        while ((totalRestanteTendencia > -10 || tempoRestanteRitmo > -10) && (diaRitmo.diff(ontem, 'days') < 45)) {

            meta.push({ t: diaRitmo, y: tempoEsforcoTotalEstimado })

            let fatorDiaSemana = obtemFatorDiaSemana(diaRitmo, projeto.participantes)

            let qtdeHorasEsperadasDia = await calculaHorasEsperadasDiaSemana(diaRitmo, projeto.participantes)

            tempoRestanteRitmo -= qtdeHorasEsperadasDia * fatorDiaSemana

            ritmo.push({ t: diaRitmo.clone(), y: tempoRestanteRitmo })

            if (diaRitmo.format('DD/MM/YYYY') == ontem.format('DD/MM/YYYY')) {
                tendencia.push({ t: diaRitmo.clone(), y: totalRestanteTendencia })
            }
            else if (diaRitmo > ontem) {
                totalRestanteTendencia -= mediaExecutadoDiaSprint * fatorDiaSemana
                tendencia.push({ t: diaRitmo.clone(), y: totalRestanteTendencia })
                ritmo
            } else {
                tendencia.push({ t: diaRitmo.clone(), y: null })
            }

            if (totalRestanteTendencia < 0 && !dataFimTendencia) {
                dataFimTendencia = diaRitmo.clone()
            }

            if (tempoRestanteRitmo < 0 && !dataFimRitmo) {
                dataFimRitmo = diaRitmo.clone()
            }

            diaRitmo = diaRitmo.clone().add(1, 'days')

        }

        let diaFimEsperado = diaRitmo.clone()

        let linhaOntem = [{ t: ontem, y: tempoEsforcoTotalEstimado }, { t: ontem, y: tempoRestanteRitmo }]

        return { executado, restante, meta, tendencia, ritmo, linhaOntem, dataInicioSprint, dataFimSprint, dataFimRitmo, dataFimTendencia, mediaExecutadoDiaSprint, tempoEsforcoTotalEstimado, totalJaExecutadoSprint }
    }
}

export default GraficoService