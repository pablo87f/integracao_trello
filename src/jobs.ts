import ManutencaoService from "./services/manutencao.service"
import Repositorio from "./repositorio"
import { QuadroManutencao } from "./types"


// import projetos from '../dados/projetos'
namespace Jobs {
    export function ProcessarDadosManutencao(criadoEm: Date) {
        const indexQuadrosManutencao = Repositorio.getItem('index.quadros-manutencao.json')
        if (indexQuadrosManutencao) {
            const nomesArquivosQuadros = Object.values(indexQuadrosManutencao)
            for (const nomeArquivoQuadro of nomesArquivosQuadros) {
                const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivoQuadro)
                // const dadosManutencao = ManutencaoService.processarDadosManutencao(quadro)
                // ManutencaoService.

            }
        }
        console.log('Sem quadros cadastrados')
        // ManutencaoService.processarDadosManutencao()
    }

}

export default Jobs
