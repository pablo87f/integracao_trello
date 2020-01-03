

import express from 'express';
import _ from "lodash";

var _feriados = require('../dados/_feriados')

import projetos from '../dados/projetos';
import path from 'path';
import { GraficoService } from "../services";

namespace GraficoController {

    export function mostrar(req: express.Request, res: express.Response) {
        res.sendFile(path.join(__dirname + '/views/grafico.view.html'));
    }

    export async function gerarGrafico(req: express.Request, res: express.Response) {
        let id_projeto = req.params.id_projeto

        let projeto = _.find(projetos, { id: parseInt(id_projeto) })
        try {
            const dados = await GraficoService.gerarBurningDown(projeto)
            const nomeProjeto = projeto ? projeto.nome : "---"

            res.send({ ...dados, nomeProjeto })


        } catch (e) {
            console.warn('erro:', e, e.message)
            res.send('Falha ao executar')
        }
    }
}

export default GraficoController