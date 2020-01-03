

var Trello = require("trello");
var trello = new Trello("87dc9de469e75e93dc71170012c930eb", "bebf362640978bcd8cab62b0121bcbf038dfab966cef8a1cb6cb2cb07c686407");


namespace ProjetoService {


    export async function imprimirMembrosDoQuadro(idQuadro: any) {

        let membros = await trello.getBoardMembers(idQuadro)

        console.warn('Qdt membros no quadro: ', membros.length)
        for (let membro of membros) {
            console.warn('membro:', membro)
        }
    }

    export async function salvarProjeto(projeto: any) {
        if (await _validarProjeto(projeto)) {

        }
    }

    export async function _validarProjeto(projeto:any) : Promise<boolean> {
        return false
    }

}
export default ProjetoService
