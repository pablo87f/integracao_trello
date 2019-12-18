

var _ = require('lodash')
var Trello = require("trello")
var moment = require('moment')
var _feriados = require('../dados/_feriados')
var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");

let GraficoController = {}

GraficoController.imprimirMembrosDoQuadro = async (idQuadro) => {

    let membros = await trello.getBoardMembers(idQuadro)

    console.warn('Qdt membros no quadro: ', membros.length)
    for (let membro of membros) {
        console.warn('membro:', membro)
    }
}

GraficoController.imprimirColecao = (colecao) => {
    console.warn(colecao ? 'Qdt itens na coleção: ' + colecao.length : 'Colecao:' + colecao)
    for (let item of colecao) {
        console.warn('item:', item)
    }
}

GraficoController.associarInfoListaProjeto = async (listasTrello, listasProjeto) => {
    let dadosListasProjeto = []

    // identificar id's das listas dos boards
    for (let listaTrello of listasTrello) {
        for (let nomeListaProjeto of Object.values(listasProjeto)) {
            if (listaTrello.name == nomeListaProjeto) {
                dadosListasProjeto.push({
                    ...listaTrello,
                    tipoLista: (_.invert(listasProjeto))[nomeListaProjeto]
                })
            }

        }
    }

    return dadosListasProjeto
}

GraficoController.extrairInfoCardsPadraoTitulo = async (cards) => {

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

GraficoController.recuperarMovimentacoesExecucao = async (cards, listasExecucao) => {

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



        for (var lista of listasExecucao) {
            for (var movimentacao of movimentacoes) {
                if (lista.id == movimentacao.data.listAfter.id) {
                    movimentacoesExecucao.push({
                        idMovi: movimentacao.id,
                        dateMovi: movimentacao.date,
                        moviListAfter: movimentacao.data.listAfter,
                        lista: {
                            id: lista.id,
                            name: lista.name,
                            tipoLista: lista.tipoLista
                        },
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

GraficoController.calculaEsforcoTotalEstimado = async (infoCards, configuracaoExecucao) => {

    let tempoBase = moment('00:00:00', 'HH:mm:ss')
    let tempoEstimado = tempoBase.clone()

    for (var info of infoCards) {
        let partesTempoEstimado = info.tempoEstimado.split(':')
        if (partesTempoEstimado.length > 0) { tempoEstimado.add(partesTempoEstimado[0], 'hours') }
        if (partesTempoEstimado.length > 1) { tempoEstimado.add(partesTempoEstimado[1], 'minutes') }

    }

    let fatorExecucao = _.sum(Object.values(configuracaoExecucao))

    let minutos = tempoEstimado.diff(tempoBase, 'minutes')

    return (minutos / 60) * fatorExecucao
}

GraficoController.converterTempoNumero = (tempo) => {

    let partesTempo = tempo.split(':')
    let horas = parseInt(partesTempo[0])
    let minutos = parseInt(partesTempo[1])

    return horas + (minutos / 60)
}

GraficoController.recuperaDiasPassadosStrint = async (diaInicial) => {
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

GraficoController.processarCards = async (cards) => {

    // extrai informações dos titulos do cards
    const infoCardsProjeto = await GraficoController.extrairInfoCardsPadraoTitulo(cards)

    return infoCardsProjeto

}

GraficoController.calcularTempoExecutadoDia = async (dia, movimentacoesExecuxao, configuracaoCalculoTempoExecucao, totalDiasAnteriores = 0) => {

    let tempoExecutadoDia = totalDiasAnteriores

    for (var movi of movimentacoesExecuxao) {


        if (movi.dateMovi
            && moment(movi.dateMovi).format('YYYY-MM-DD') == moment(dia).format('YYYY-MM-DD')) {
            let tempoExecutadoCard = GraficoController.converterTempoNumero(movi.card.tempoEstimado) * configuracaoCalculoTempoExecucao[movi.lista.tipoLista]
            tempoExecutadoDia += tempoExecutadoCard
        }
    }

    return tempoExecutadoDia

}

GraficoController.filtrarListasExecucao = async (listas, nomesListas, tiposListaExecucao) => {

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

GraficoController.filtrarCardsExecucao = async (cards, listasExecucao) => {
    let cardsExecucao = []

    for (var lista of listasExecucao) {
        for (var card of cards) {
            if (card.idList == lista.id) {
                cardsExecucao.push({ ...card, tipoLista: lista.tipoLista })
            }
        }
    }

    return cardsExecucao
}

GraficoController.calculaHorasEsperadasDiaSemana = async (dia, equipeProgramadores) => {

    let eh_feriado = _feriados[dia.format('DD/MM/YYYY')]
    if (eh_feriado) return 0
    
    // obtem o dia da semana
    let diaSemana = dia.day() + 1

    let qtdeHorasEsperadasDia = 0

    for (let membro of equipeProgramadores) {
        if (membro && membro.cargo && membro.cargo.cargaHorariaSemanal && membro.cargo.fatorEsperadoCargaHorariaSemanal) {
            let cargaDia = membro.cargo.cargaHorariaSemanal[diaSemana]
            let percentProdutivoEsperadoDia = membro.cargo.fatorEsperadoCargaHorariaSemanal[diaSemana]

            let tempoEstimadoAtividadesExtrasDiarias = 0
            if (membro.tempoAtividadesExtrasDiarias) {
                for (let valorHoras of Object.values(membro.tempoAtividadesExtrasDiarias)) {
                    tempoEstimadoAtividadesExtrasDiarias += valorHoras
                }
            }

            qtdeHorasEsperadasDia += (cargaDia * percentProdutivoEsperadoDia) - (tempoEstimadoAtividadesExtrasDiarias * percentProdutivoEsperadoDia)
        }
    }

    return qtdeHorasEsperadasDia
}

GraficoController.obtemFatorDiaSemana = (dia, equipeProgramadores) => {

    // let eh_feriado = _feriados[dia.format('DD/MM/YYYY')]
    // if (eh_feriado) return 0

    // let diaSemana = dia.day() + 1

    // let qtdeRelativaDia = 1 // se for de segunda a sexta

    // if (diaSemana == 1) { // se for domingo
    //     qtdeRelativaDia = 0
    // }
    // else if (diaSemana == 7) { // se for sábado
    //     qtdeRelativaDia = 0.375
    // }
    // return qtdeRelativaDia


    let eh_feriado = _feriados[dia.format('DD/MM/YYYY')]
    if (eh_feriado) return 0
    
    // obtem o dia da semana
    let diaSemana = dia.day() + 1

    let fatorEsperadoEquipeDia = 0
    let qtdeMembrosAtivosDia = 0

    for (let membro of equipeProgramadores) {
        if (membro && membro.cargo && membro.cargo.cargaHorariaSemanal && membro.cargo.fatorEsperadoCargaHorariaSemanal && membro.cargo.cargaHorariaDia && membro.cargo.maxFatorEsperadoDia) {
            let cargaDia = membro.cargo.cargaHorariaSemanal[diaSemana]
            let percentProdutivoEsperadoDia = membro.cargo.fatorEsperadoCargaHorariaSemanal[diaSemana]
            
            fatorEsperadoEquipeDia += (cargaDia / membro.cargo.cargaHorariaDia) *(percentProdutivoEsperadoDia/membro.cargo.maxFatorEsperadoDia)

            qtdeMembrosAtivosDia += (percentProdutivoEsperadoDia > 0 ? 1: 0)
        }
    }

    return qtdeMembrosAtivosDia > 0 ? fatorEsperadoEquipeDia / qtdeMembrosAtivosDia : 0
}

GraficoController.gerarBurningDown = async (projeto) => {

    let dataInicioSprint, dataFimSprint, dataFimRitmo = null, dataFimTendencia = null
    // recuperar todos os cards do board 
    let cards = await trello.getCardsOnBoard(projeto.idBoard)

    // recuperar os cards do board 
    let cardsProcessados = await GraficoController.processarCards(cards)

    cardsProcessados = _.filter(cardsProcessados, (card) => _.startsWith(card.prefixo, projeto.prefixo))

    const tempoEsforcoTotalEstimado = await GraficoController.calculaEsforcoTotalEstimado(cardsProcessados, projeto.configuracaoCalculoTempoExecucao)

    // recuperar listas do board
    const listas = await trello.getListsOnBoard(projeto.idBoard)
    const dadosListasProjeto = await GraficoController.associarInfoListaProjeto(listas, projeto.nomesListas)
    const listasExecucao = await GraficoController.filtrarListasExecucao(dadosListasProjeto, projeto.nomesListas, Object.keys(projeto.configuracaoCalculoTempoExecucao))

    // recuperar cards de execucao
    const cardsExecucao = await GraficoController.filtrarCardsExecucao(cardsProcessados, listasExecucao)

    const movimentacoesExecuxao = await GraficoController.recuperarMovimentacoesExecucao(cardsExecucao, listasExecucao)

    // processa os dias da sprint
    let diasSprint = await GraficoController.recuperaDiasPassadosStrint(projeto.dataInicioSprint)

    // calcula o tempo executado do dia pela posição dos cards nas listas

    let restante = []
    let executado = []
    let meta = []

    let totalJaExecutadoSprint = 0
    let qtdeRelativaDiasTrabalhadosSprint = 0

    for (var dia of diasSprint) {

        let totalExecutadoDia = await GraficoController.calcularTempoExecutadoDia(dia, movimentacoesExecuxao, projeto.configuracaoCalculoTempoExecucao, totalJaExecutadoSprint)

        totalJaExecutadoSprint = totalExecutadoDia
        restante.push({ t: dia, y: tempoEsforcoTotalEstimado - totalExecutadoDia })
        executado.push({ t: dia, y: totalExecutadoDia })

        let fatorDiaSemana = GraficoController.obtemFatorDiaSemana(dia, projeto.equipeProgramadores)
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

    while ((totalRestanteTendencia > -10 || tempoRestanteRitmo > -10) && (diaRitmo.diff(ontem, 'days') < 60)) {

        meta.push({ t: diaRitmo, y: tempoEsforcoTotalEstimado })

        let fatorDiaSemana = GraficoController.obtemFatorDiaSemana(diaRitmo, projeto.equipeProgramadores)

        let qtdeHorasEsperadasDia = await GraficoController.calculaHorasEsperadasDiaSemana(diaRitmo, projeto.equipeProgramadores)

        tempoRestanteRitmo -= qtdeHorasEsperadasDia * fatorDiaSemana

        ritmo.push({ t: diaRitmo.clone(), y: tempoRestanteRitmo })

        if (diaRitmo.format('DD/MM/YYYY') == ontem.format('DD/MM/YYYY')) {
            tendencia.push({ t: diaRitmo.clone(), y: totalRestanteTendencia })
        }
        else if (diaRitmo > ontem) {
            totalRestanteTendencia -= mediaExecutadoDiaSprint * fatorDiaSemana
            tendencia.push({ t: diaRitmo.clone(), y: totalRestanteTendencia })
            restante.push({ t: diaRitmo, y: null })
            executado.push({ t: diaRitmo, y: null })

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

    return { executado, restante, meta, tendencia, ritmo, linhaOntem, dataInicioSprint, dataFimSprint, dataFimRitmo, dataFimTendencia, mediaExecutadoDiaSprint }
}

export default GraficoController