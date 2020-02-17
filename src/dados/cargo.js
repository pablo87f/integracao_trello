
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
    desenvolvedorVoltandoSabadoEstudos: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.5,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            '1': 0,
            '2': 0.65,
            '3': 0.65,
            '4': 0.65,
            '5': 0.65,
            '6': 0.65,
            '7': 0,
        }
    },
    desenvolvedorInicial2SabadoEstudos: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.65,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            '1': 0,
            '2': 0.65,
            '3': 0.65,
            '4': 0.65,
            '5': 0.65,
            '6': 0.65,
            '7': 0,
        }
    },
    desenvolvedorAnalista: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.8,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: _padrao.fatorEsperadoCargaHorariaSemanal
    },
    desenvolvedorInicialVendas: {
        cargaHorariaDia: 8,
        maxFatorEsperadoDia: 0.5,
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            '1': 0,
            '2': 0.4,
            '3': 0.4,
            '4': 0.4,
            '5': 0.4,
            '6': 0.4,
            '7': 0,
        }
    },
}

module.exports = cargo