

const pessoa = require('./pessoa')
const cargo = require('./cargo')
const _padrao = require('./_padrao')


const idBoardMateusApp = 'ctc37b0n' // 'ctc37b0n'//'55eH7xza' // 5cabb4d1279f154d97ea16f9
const idBoardProjetoTeste = '55eH7xza'

const _equipeProgramadoresPadrao = [
    { pessoa: pessoa.Pablo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Ricardo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Teo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
]

module.exports = [
    {
        id: 1,
        nome: 'Projeto Teste',
        dataInicioSprint: '2019-04-25',
        idBoard: idBoardProjetoTeste,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: _equipeProgramadoresPadrao,
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao
    },
    {
        id: 2,
        nome: 'Merge home com prod. e cód. barras',
        dataInicioSprint: '2019-04-29',
        idBoard: idBoardMateusApp,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Teo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao

    }

]