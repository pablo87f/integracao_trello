import _ from "lodash";
import express from 'express';

// import projetos from '../dados/projetos';
// import pessoas from '../dados/pessoa';
import Repositorio from "../repositorio";
import { time } from "console";

namespace ViewsProjetoController {

    function removeDuplicates(myArr: Array<any>, prop: any) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    export function create(req: express.Request, res: express.Response) {
        // const membros = Object.values(pessoas)
        

        return res.render('./projeto/new.html', {})
    }
}

export default ViewsProjetoController