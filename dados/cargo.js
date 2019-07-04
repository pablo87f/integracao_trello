
const _padrao = require('./_padrao')

const cargo = {
    desenvolvedor: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.8,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: _padrao.fatorEsperadoCargaHorariaSemanal
    },
    desenvolvedorInicial: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.5,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            '1': 0,
            '2': 0.5,
            '3': 0.5,
            '4': 0.5,
            '5': 0.5,
            '6': 0.5,
            '7': 0.25,
        }
    },
    desenvolvedorSabadoEstudos: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.8,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            ..._padrao.fatorEsperadoCargaHorariaSemanal,
            '7': 0,
        }
    },
    desenvolvedorInicialSabadoEstudos: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.5,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            '1': 0,
            '2': 0.5,
            '3': 0.5,
            '4': 0.5,
            '5': 0.5,
            '6': 0.5,
            '7': 0,
        }
    },
}

module.exports = cargo