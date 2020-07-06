import _ from "lodash";
import express from 'express';
import Repositorio from "../repositorio";
import ManutencaoService from "../services/manutencao.service";

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

    
    export function show(req: express.Request, res: express.Response) {
        if (!req.params.id) res.sendStatus(401);

        let idQuadroManutencao: number = 0

        try {
            idQuadroManutencao = parseInt(req.params.id);
        }
        catch (e) {
            res.sendStatus(401);
        }

        const nomeArquivo = `manutencao.${idQuadroManutencao}.json`

        const quadroManutencao = Repositorio.getItem(nomeArquivo)

        if (!quadroManutencao) res.sendStatus(404)
        
        res.render('maintenance/detalhes/index.html', { 'quadro_manutencao': quadroManutencao })
    }

    
}

export default MaintenanceController