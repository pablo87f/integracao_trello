import _ from "lodash";
import express from 'express';

import projetos from '../dados/projetos';
import pessoas from '../dados/pessoa';
import Repositorio from "../repositorio";

namespace ViewsProjetoController {
    
    export function create(req: express.Request, res: express.Response) {
        const membros = Object.values(pessoas)
        return res.render('./projeto/novo.html', {
            membros
        })
    }
}

export default ViewsProjetoController