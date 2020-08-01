import ManutencaoService from "./services/manutencao.service"
import Repositorio from "./repositorio"
import { QuadroManutencao } from "./types"


// import projetos from '../dados/projetos'
namespace Jobs {
    export async function SalvarDadosManutencao() {
        //recupera a lista de ids quadros manutencao
        const indexQuadrosManutencao = Repositorio.getItem('index.quadros-manutencao.json')
        if (indexQuadrosManutencao) {
            const nomesArquivosQuadros = Object.values(indexQuadrosManutencao)
            // percorre os quadros um por um
            for (const nomeArquivoQuadro of nomesArquivosQuadros) {
                const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivoQuadro)
                // extrai os dados gerais (card, listas , etiquetas)
                const dadosGerais = await ManutencaoService.extrairDadosGeraisManutencao(quadro)
                //salva dados gerais para a semanda atual
                ManutencaoService.salvarDadosSemanaisQuadroManutencao(dadosGerais, quadro.id)
                
                console.log('SalvarDadosManutencao: Sucesso')
                return true
                // ManutencaoService.

            }
        }
        console.log('Sem quadros cadastrados')
    }

    export async function ArquivarDadosManutencao() {
        console.log('ArquivarDadosManutencao: Sucesso')
    }

}

export default Jobs
