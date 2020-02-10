// { 'planejado': 'Planejado - FRONT - Refatoração M2 - Home' }
export interface ListaTrello {
    nome: string
    titulo: string
}

// { '8horas', 8 }
export interface ContratoCargaHoraria {
    nome: number
    tempo: number
}

// {
//     '1': 0,
//     '2': 0.5,
//     '3': 0.5,
//     '4': 0.5,
//     '5': 0.5,
//     '6': 0.5,
//     '7': 0.25,
// }
export interface CargaHorariaSemanal {
    '1': number
    '2': number
    '3': number
    '4': number
    '5': number
    '6': number
    '7': number
}

// { apelido: 'Pablo', user: 'pablofernandes4', nome: 'Pablo Fernandes' }
export interface Pessoa {
    nome: string
    nomeCompleto: string 
    user: string 
}

export interface Cargo {
    nome: string,
    cargaHorariaDia: number,
    maxFatorEsperadoDia: 8,
    cargaHorariaSemanal: CargaHorariaSemanal,
    fatorEsperadoCargaHorariaSemanal: ContratoCargaHoraria
}

export interface ConfiguracaoFuncionario {
    pessoa: Pessoa
    cargo: Cargo
    atividadesExtraDiaria: Array<AtividadeExtraDiaria>
}

// { nome: 'reuniao', tempo: 1 }
export interface AtividadeExtraDiaria {
    nome: string
    tempo: number
}

// { nome: 'homologacao', contabilizado: 1 }
export interface ConfiguracaoExecucaoLista {
    lista: ListaTrello,
    contabilizado:1 
}

// { id: 1, nome: 'ativo', cor: 'green', classeEstilo: 'primary' }
export interface StatusProjeto {
    id: number,
    nome: string 
    cor: string 
    classeEstilo: string
}

// {
//     id: 15,
//     prefixo: 'BON',
//     nome: 'Bonificação',
//     dataInicioSprint: '2020-01-15',
//     dataEntregaSprint: '',
//     idBoard: idBoardMateusApp,
//     nomesListas: {
//         ..._padrao.listas,
//         'planejado': 'Planejado - BON - Bonificação',
//         'concluido': 'Concluído - BON - Bonificação'
//     },
//     diasDuracaoSprint: _padrao.diasDuracaoSprint,
//     equipeProgramadores: [
//         { pessoa: pessoa.Adriano, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: { ..._padrao.tempoAtividadesExtrasDiarias, 'manutencao': 2.0 } },
//         { pessoa: pessoa.Elaine, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: { ..._padrao.tempoAtividadesExtrasDiarias, 'manutencao': 2.0 } },
//         { pessoa: pessoa.Luis, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: _padrao.tempoAtividadesExtrasDiarias },
//         { pessoa: pessoa.Teo, cargo: cargo.desenvolvedorSabadoEstudos, tempoAtividadesExtrasDiarias: { ..._padrao.tempoAtividadesExtrasDiarias, 'cadastro': 1.0 } },
//     ],
//     configuracaoCalculoTempoExecucao: _padrao.configuracaoCalculoTempoExecucao,
//     status: statusProjetos.ativo
// }
export interface Projeto {
    id: number
    prefixo: string
    nome: string
    dataInicioSprint: Date
    dataEntregaSprint?: Date
    idBoard: string
    nomesListas: Array<ListaTrello>
    diasDuracaoSprint: number
    equipeProgramadores: Array<ConfiguracaoFuncionario>
    configuracaoCalculoTempoExecucao: Array<ConfiguracaoExecucaoLista>
    status: StatusProjeto
}
