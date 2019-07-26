

const pessoa = require('./pessoa')
const cargo = require('./cargo')
const _padrao = require('./_padrao')


const idBoardMateusApp = 'ctc37b0n' // 'ctc37b0n'//'55eH7xza' // 5cabb4d1279f154d97ea16f9
const idBoardProjetoTeste = '55eH7xza'
const idBoardMateusCash = '4iMXNbY2'
const statusProjetos = {
    ativo: { id: 1, nome: 'ativo', cor: 'green', classeEstilo: 'primary' },
    pausado: { id: 2, nome: 'pausado', cor: 'orange', classeEstilo: 'warning' },
    finalizado: { id: 3, nome: 'entrege', cor: 'gray', classeEstilo: 'success' },
    arquivado: { id: 4, nome: 'arquivado', cor: 'red', classeEstilo: 'secondary' }
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
        dataEntregaSprint: '',
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
        dataEntregaSprint: '',
        idBoard: idBoardMateusApp,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Teo, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.finalizado
    },
    {
        id: 3,
        prefixo: 'CPC',
        nome: 'Catálogo Produtos Cashback',
        dataInicioSprint: '2019-05-07',
        dataEntregaSprint: '',
        idBoard: idBoardMateusCash,
        nomesListas: _padrao.listas,
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Luis, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.MarcosCosta, cargo: cargo.desenvolvedor, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.finalizado
    },
    {
        id: 4,
        prefixo: 'HO',
        nome: 'Refatoração M2 - Home com produtos',
        dataInicioSprint: '2019-07-02',
        dataEntregaSprint: '2019-07-12',
        idBoard: idBoardMateusApp,
        nomesListas: {
            ..._padrao.listas,
            'planejado':'Planejado - FRONT - Refatoração M2 - Home',
            'concluido': 'Concluído - FRONT - Refatoração M2 - Home'
        },
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.MarcosCosta, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Luis, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.finalizado
    },
    {
        id: 5,
        prefixo: 'BL',
        nome: 'Busca e Seleção de lojas',
        dataInicioSprint: '2019-07-17',
        dataEntregaSprint: '2019-07-25',
        idBoard: idBoardMateusApp,
        nomesListas: {
            ..._padrao.listas,
            'planejado':'Planejado - FRONT - Busca e Seleção Lojas',
            'concluido': 'Concluído - FRONT - Busca e Seleção Lojas'
        },
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Teo, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.MarcosCosta, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Luis, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.finalizado
    },
    {
        id: 6,
        prefixo: 'IR',
        nome: 'Infra Ricardinho',
        dataInicioSprint: '2019-07-17',
        dataEntregaSprint: '',
        idBoard: 'ilBSsFhM',
        nomesListas: {
            ..._padrao.listas,
            'fazendo': 'Fazendo',
            'planejado':'Planejado',
            'concluido': 'Concluído'
        },
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Ricardo, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: {
            'concluido': 1
        },
        status: statusProjetos.ativo
    },
    {
        id: 7,
        prefixo: 'RC',
        nome: 'Refatoração cache',
        dataInicioSprint: '2019-07-26',
        dataEntregaSprint: '',
        idBoard: idBoardMateusApp,
        nomesListas: {
            ..._padrao.listas,
            'planejado':'Planejado - RC - Refatoração Cache',
            'concluido': 'Concluído - RC - Refatoração Cache'
        },
        diasDuracaoSprint: _padrao.diasDuracaoSprint,
        equipeProgramadores: [
            { pessoa: pessoa.Teo, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.MarcosCosta, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Luis, cargo: cargo.desenvolvedorInicialSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
            { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
        ],
        configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
        status: statusProjetos.ativo
    },

]