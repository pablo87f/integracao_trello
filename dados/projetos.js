

const pessoa = require('./pessoa')
const cargo = require('./cargo')
const _padrao = require('./_padrao')


const idBoardMateusApp = 'ctc37b0n' // 'ctc37b0n'//'55eH7xza' // 5cabb4d1279f154d97ea16f9
const idBoardProjetoTeste = '55eH7xza'
const idBoardMateusCash = '4iMXNbY2'
const statusProjetos = {
    ativo: { id: 1, nome: 'ativo', cor: 'green', classeEstilo: 'success' },
    pausado: { id: 2, nome: 'pausado', cor: 'orange', classeEstilo: 'warning' },
    finalizado: { id: 3, nome: 'finalizado', cor: 'gray', classeEstilo: 'secondary' },
    arquivado: { id: 4, nome: 'arquivado', cor: 'red', classeEstilo: 'danger' }
}

const _equipeProgramadoresPadrao = [
    { pessoa: pessoa.Pablo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Ricardo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
    { pessoa: pessoa.Teo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
]

module.exports = [
    {
        id: 1,
        prefixo: 'GA',
        nome: 'Gráfico de acompanhamento',
        dataInicioSprint: '2019-05-02',
        idBoard: idBoardProjetoTeste,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [{ pessoa: pessoa.Pablo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.pausado
    },
    {
        id: 2,
        prefixo: 'MHP',
        nome: 'Merge home com prod. e cód. barras',
        dataInicioSprint: '2019-04-29',
        idBoard: idBoardMateusApp,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Teo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.ativo
    },
    {
        id: 3,
        prefixo: 'CPC',
        nome: 'Catálogo Produtos Cashback',
        dataInicioSprint: '2019-05-07',
        idBoard: idBoardMateusCash,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Luis, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.MarcosCosta, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.finalizado
    }
]