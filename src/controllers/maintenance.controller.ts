import _ from "lodash";
import express from 'express';
import Repositorio from "../repositorio";

namespace MaintenanceController {

    export async function index(req: express.Request, res: express.Response) {

        const indexManutencoes = Repositorio.getAll('index.manutencoes.json')
        const projetosPromisses = Object.values(indexManutencoes).map((nomeArquivoManutencao) => {
            return Repositorio.getItem(nomeArquivoManutencao)
        })

        const manutencoes = await Promise.all(projetosPromisses)

        const manutencoesOrdenadas = _.orderBy(manutencoes, ['status.id', 'id'], ['asc', 'desc'])

        return res.render('./maintenance/index.html', {
            'manutencoes': manutencoesOrdenadas,
            'manutencao_selecionado': "mm-active"
        })
    }

    
}

export default MaintenanceController