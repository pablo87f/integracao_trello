
const _padrao = require('./_padrao')

const cargo = {
    desenvolvedor: {
        cargaHorariaSemanal: _padrao.cargaHorariaSemanal,
        fatorEsperadoCargaHorariaSemanal: _padrao.fatorEsperadoCargaHorariaSemanal
    },
    desenvolvedorInicial: {
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
    }
}

module.exports = cargo