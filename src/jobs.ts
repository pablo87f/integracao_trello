import ManutencaoService from "./services/manutencao.service"
import Repositorio from "./repositorio"
import { QuadroManutencao } from "./types"


// import projetos from '../dados/projetos'
namespace Jobs {
    export async function SalvarDadosManutencao() {
        const indexQuadrosManutencao = Repositorio.getItem('index.quadros-manutencao.json')
        if (indexQuadrosManutencao) {
            const nomesArquivosQuadros = Object.values(indexQuadrosManutencao)
            for (const nomeArquivoQuadro of nomesArquivosQuadros) {
                const quadro: QuadroManutencao = Repositorio.getItem(nomeArquivoQuadro)
                const dadosGerais = await ManutencaoService.extrairDadosGeraisManutencao(quadro)
                const dadosProcessados = await ManutencaoService.processarDadosManutencao(dadosGerais)
                ManutencaoService.salvarDadosSemanaisQuadroManutencao(dadosGerais, dadosProcessados, quadro.id)
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
