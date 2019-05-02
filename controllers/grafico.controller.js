

var _ = require('lodash')
var Trello = require("trello")
var moment = require('moment')
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
                indice: dadosTituloCard[0].trim(),
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
                            indice: card.indice,
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

GraficoController.calculaEsforcoTotalEstimado = async (infoCards) => {

    let tempoBase = moment('00:00:00', 'HH:mm:ss')
    let tempoEstimado = tempoBase.clone()

    for (var info of infoCards) {
        let partesTempoEstimado = info.tempoEstimado.split(':')
        if (partesTempoEstimado.length > 0) { tempoEstimado.add(partesTempoEstimado[0], 'hours') }
        if (partesTempoEstimado.length > 1) { tempoEstimado.add(partesTempoEstimado[1], 'minutes') }

    }

    let minutos = tempoEstimado.diff(tempoBase, 'minutes')

    return (minutos / 60) * 1.5
}

GraficoController.converterTempoNumero = (tempo) => {

    let partesTempo = tempo.split(':')
    let horas = parseInt(partesTempo[0])
    let minutos = parseInt(partesTempo[1])

    return horas + (minutos / 60)
}

GraficoController.recuperaDiasPassadosStrint = async (diaInicial) => {
    const diaInicioSprint = moment(diaInicial, 'YYYY-MM-DD')
    const hoje = moment()
    const qtdeDias = hoje.diff(diaInicioSprint, 'days')

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

    let diaSemana = dia.day() + 1

    let qtdeHorasEsperadasDia = 0

    for (let membro of equipeProgramadores) {
        if (membro && membro.cargo && membro.cargo.cargaHorariaSemanal && membro.cargo.fatorEsperadoCargaHorariaSemanal) {
            let cargaDia = membro.cargo.cargaHorariaSemanal[diaSemana]
            let fatorEsperadoDia = membro.cargo.fatorEsperadoCargaHorariaSemanal[diaSemana]

            let tempoEstimadoAtividadesExtrasDiarias = 0
            if (membro.tempoAtividadesExtrasDiarias) {
                for (let valorHoras of Object.values(membro.tempoAtividadesExtrasDiarias)) {
                    tempoEstimadoAtividadesExtrasDiarias += valorHoras
                }
            }

            qtdeHorasEsperadasDia += (cargaDia * fatorEsperadoDia) - (tempoEstimadoAtividadesExtrasDiarias * fatorEsperadoDia)
        }
    }

    return qtdeHorasEsperadasDia
}

GraficoController.gerarBurningDown = async (projeto) => {

    let dataInicioSprint, dataFimSprint, dataFimRitmo, dataFimTendencia
    // recuperar todos os cards do board 
    let cards = await trello.getCardsOnBoard(projeto.idBoard)

    // recuperar os cards do board 
    let cardsProcessados = await GraficoController.processarCards(cards)

    const tempoEsforcoTotalEstimado = await GraficoController.calculaEsforcoTotalEstimado(cardsProcessados)
    console.warn('tempoEsforcoTotalEstimado', tempoEsforcoTotalEstimado)

    // recuperar listas do board
    const listas = await trello.getListsOnBoard(projeto.idBoard)
    const dadosListasProjeto = await GraficoController.associarInfoListaProjeto(listas, projeto.nomesListas)
    const listasExecucao = await GraficoController.filtrarListasExecucao(dadosListasProjeto, projeto.nomesListas, Object.keys(projeto.configuracaoCalculoTempoExecucao))

    // recuperar cards de execucao
    const cardsExecucao = await GraficoController.filtrarCardsExecucao(cardsProcessados, listasExecucao)

    const movimentacoesExecuxao = await GraficoController.recuperarMovimentacoesExecucao(cardsExecucao, listasExecucao)

    GraficoController.imprimirColecao(movimentacoesExecuxao)
    // processa os dias da sprint
    let diasSprint = await GraficoController.recuperaDiasPassadosStrint(projeto.dataInicioSprint)

    // calcula o tempo executado do dia pela posição dos cards nas listas

    let executado = []
    let meta = []

    let totalJaExecutadoSprint = 0
    let qtdeRelativaDiasPassadosSprint = 0

    for (var dia of diasSprint) {

        let totalExecutadoDia = await GraficoController.calcularTempoExecutadoDia(dia, movimentacoesExecuxao, projeto.configuracaoCalculoTempoExecucao, totalJaExecutadoSprint)

        totalJaExecutadoSprint = totalExecutadoDia
        executado.push({ t: dia, y: tempoEsforcoTotalEstimado - totalExecutadoDia })


        let qtdeRelativaDia = 0
        let diaSemana = dia.day() + 1
        if (diaSemana == 1) {
            qtdeRelativaDia = 0
        }
        else if (diaSemana == 7) {
            qtdeRelativaDia = 0.375
        }
        else {
            qtdeRelativaDia = 1
        }
        qtdeRelativaDiasPassadosSprint += qtdeRelativaDia
    }

    let mediaExecutadoDiaSprint = totalJaExecutadoSprint / qtdeRelativaDiasPassadosSprint

    console.warn('totalJaExecutadoSprint', totalJaExecutadoSprint, 'qtdeRelativaDiasPassadosSprint', qtdeRelativaDiasPassadosSprint, 'mediaExecutadoDiaSprint', mediaExecutadoDiaSprint)

    let tempoRestanteRitmo = tempoEsforcoTotalEstimado
    let diaInicioSprint = moment(projeto.dataInicioSprint, 'YYYY-MM-DD')
    dataInicioSprint = diaInicioSprint
    dataFimSprint = dataInicioSprint.clone().add(projeto.diasDuracaoSprint, 'days')
    let diaRitmo = diaInicioSprint.clone()

    let ritmo = []
    let tendencia = []

    let hoje = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD')

    let totalRestanteTendencia = tempoEsforcoTotalEstimado - totalJaExecutadoSprint

    while ((totalRestanteTendencia > -20 || tempoRestanteRitmo > -20) && ritmo.length <= (projeto.diasDuracaoSprint * 2)) {

        ritmo.push({ t: diaRitmo.clone(), y: tempoRestanteRitmo })

        meta.push({ t: diaRitmo, y: tempoEsforcoTotalEstimado })

        let qtdeHorasEsperadasDia = await GraficoController.calculaHorasEsperadasDiaSemana(diaRitmo, projeto.equipeProgramadores)

        tempoRestanteRitmo -= qtdeHorasEsperadasDia

        if (diaRitmo >= hoje) {
            tendencia.push({ t: diaRitmo, y: totalRestanteTendencia })
            if (diaRitmo.day() + 1 == 1) { fatorDiaSemana = 0.001 }
            else if (diaRitmo.day() + 1 == 7) { fatorDiaSemana = 0.357 }
            else { fatorDiaSemana = 1 }
            totalRestanteTendencia -= mediaExecutadoDiaSprint * fatorDiaSemana
            if (diaRitmo > hoje) {
                executado.push({ t: diaRitmo, y: null })
            }
        } else {
            tendencia.push({ t: diaRitmo, y: null })
        }

        diaRitmo = diaRitmo.clone().add(1, 'days')

        if (!dataFimTendencia && totalRestanteTendencia < 0) {
            dataFimTendencia = diaRitmo.clone()
        }

        if (!dataFimRitmo && tempoRestanteRitmo < 0) {
            dataFimRitmo = diaRitmo.clone()
        }
    }

    executado.push({ t: diaRitmo, y: null })

    ritmo.push({ t: diaRitmo, y: tempoRestanteRitmo })

    tendencia.push({ t: diaRitmo, y: totalRestanteTendencia })

    meta.push({ t: diaRitmo, y: tempoEsforcoTotalEstimado })

    let diaFimEsperado = diaRitmo.clone()

    let linhaHoje = [{ t: hoje, y: tempoEsforcoTotalEstimado }, { t: hoje, y: tempoRestanteRitmo }]

    return { executado, meta, tendencia, ritmo, linhaHoje, dataInicioSprint, dataFimSprint, dataFimRitmo, dataFimTendencia }
}

module.exports = GraficoController