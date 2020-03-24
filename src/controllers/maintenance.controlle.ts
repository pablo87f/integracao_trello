import _ from "lodash";
import express from 'express';

import projetos from '../dados/projetos';
import Repositorio from "../repositorio";
import StatusProjetos from "../dados/status-projeto";
import { GraficoService } from "../services";

namespace MaintenanceController {

    export function index(req: express.Request, res: express.Response) {
        return res.render('./home/index.html', {
            'projetos':[],
            'manutencao_selecionado': "mm-active"
        })
    }
}

export default MaintenanceController