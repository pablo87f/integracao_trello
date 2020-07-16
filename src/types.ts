// { 'planejado': 'Planejado - FRONT - Refatoração M2 - Home' }
export interface ListaProjeto {
    titulo: string,
    valorExecucao: number,
    listaQuadro?: any
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
export interface Time {
    id: number
    nome: string
}

export interface Equipe {
    id: number
    nome: string
    idTime: number
}

export interface Pessoa {
    id: number
    nome: string
    user: string
    ativo: boolean
    time?: Time
    equipe?: Equipe
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

export interface Participante {
    pessoa: Pessoa
    percentualDiarioEsperado: number
}

// { nome: 'reuniao', tempo: 1 }
export interface AtividadeExtraDiaria {
    nome: string
    tempo: number
}

// { nome: 'homologacao', contabilizado: 1 }


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
    listasProjeto: Array<ListaProjeto>
    diasDuracaoSprint: number
    participantes: Array<Participante>
    status: StatusProjeto
    versao: string
    dadosGrafico?: any
}
export interface DadosGeraisManutencao {
    cartoes: Array<any>
    listas: Array<any>
    etiquetas: Array<any>
}

export interface DadosProcessadosManutencao {
    qtdsCardsEtiquetasImportancia: any
    qtdsCardsEtiquetasTipo: any
    qtdsCardsListas: any
    etiquetasImportancia: Array<any>
    etiquetasTipo: Array<any>
}


export interface DadosQuadroManutencaoIntervalo {
    dtInicio: Date
    dtFim: Date
    numSemana: number
    dadosGerais: DadosGeraisManutencao
    dadosProcessados: DadosProcessadosManutencao
}

export interface QuadroManutencao {
    id: number
    nome: string
    idBoard: string
    idListaConclusao?: string;
    dataUltimoProcessamento?: Date
    dadosManutencao: Array<DadosQuadroManutencaoIntervalo>;
}

export interface ProjetoManutencao {
    id: number
    nome: string
    diasDuracaoCiclo: number
    idBoard: string
    status: StatusProjeto
}

export interface TrelloLabel {
    color?: String;
    id: string;
    idBoard: string
    name: string
}