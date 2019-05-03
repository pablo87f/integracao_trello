
let ProjetoController = {}

ProjetoController.imprimirMembrosDoQuadro = async (idQuadro) => {

    let membros = await trello.getBoardMembers(idQuadro)

    console.warn('Qdt membros no quadro: ', membros.length)
    for (let membro of membros) {
        console.warn('membro:', membro)
    }
}

ProjetoController.salvarProjeto = async (projeto) =>{
    if(ProjetoController._validarProjeto(projeto)){
        
    }
}

ProjetoController._validarProjeto = async (projeto) => {

}
