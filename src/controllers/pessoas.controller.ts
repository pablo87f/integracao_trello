import _ from "lodash";
import express from 'express';

// import projetos from '../dados/projetos';
import Repositorio from "../repositorio";
import StatusProjetos from "../dados/status-projeto";
import { GraficoService } from "../services";
import { Projeto, ListaProjeto, Participante, Pessoa } from "../types";

// import pessoas from "../dados/pessoa";

namespace PessoasController {

    function removeDuplicates(myArr: Array<any>, prop: any) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    export async function index(req: express.Request, res: express.Response) {

        let todosTimes: any = []
        const pessoas = (Repositorio.getAll('pessoas.json') || [])
            .filter((p: any) => { return p.ativo })
            .map((p: any) => {
                const nomeTime = p.time ? p.time.nome : ''
                const nomeEquipe = p.equipe ? p.equipe.nome : ''
                const nome = nomeEquipe ? `${p.nome} - ${nomeEquipe}` : p.nome

                if (p.time) todosTimes.push(p.time)

                return {
                    ...p,
                    nomeTime,
                    nomeEquipe,
                    nome
                }
            })

        const times = removeDuplicates(todosTimes, 'id')

        return res.send({ pessoas, times })

    }
}

export default PessoasController