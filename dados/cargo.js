
const _padrao = require('./_padrao')

const cargo = {
    desenvolvedor: {
        contrato: _padrao.contratoCargaHorariaDia["8horas"],
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: _padrao.fatorEsperadoCargaHorariaSemanal
    },
    desenvolvedorInicial: {
        contrato: _padrao.contratoCargaHorariaDia["8horas"],
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
        contrato: _padrao.contratoCargaHorariaDia["8horas"],
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: {
            ..._padrao.fatorEsperadoCargaHorariaSemanal,
            '7': 0,
        }
    },
    desenvolvedorInicialSabadoEstudos: {
        contrato: _padrao.contratoCargaHorariaDia["8horas"],
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