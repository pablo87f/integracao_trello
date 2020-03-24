

let _padrao = {}


_padrao.listas = {
    'backlog': 'Backlog',
    'planejado': 'Planejado',
    'fazendo': 'Fazendo',
    'homologacao': 'Homologando',
    'concluido': 'Concluído'
}

_padrao.diasDuracaoSprint = 15

_padrao.contratoCargaHorariaDia = {
    '8horas': 8,
    '6horas': 6,
}

_padrao.cargaHorariaSemanal = {
    '1': 0,
    '2': 8,
    '3': 8,
    '4': 8,
    '5': 8,
    '6': 8,
    '7': 4,
}

_padrao.fatorEsperadoCargaHorariaSemanal = {
    '1': 0,
    '2': 0.8,
    '3': 0.8,
    '4': 0.8,
    '5': 0.8,
    '6': 0.8,
    '7': 0.6,
}

_padrao.configuracaoCalculoTempoExecucao = {
    'homologacao': 1,
    'concluido': 0.5
}

_padrao.tempoAtividadesExtrasDiarias = {
    'reuniao': 1,
    //'bugs': 0.5,
}


module.exports = _padrao