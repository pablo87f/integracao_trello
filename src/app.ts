
import _ from "lodash";
import express from 'express';
import mustacheExpress from 'mustache-express';
import mustache from 'mustache';
import path from 'path';
import bodyParser from 'body-parser'

import projetos from './dados/projetos';
import GraficoController from './controllers/grafico.controller';

import repo from './repositorio';
import { ProjetoController, FuncionalidadeController } from "./controllers";

const app = express();
var publicPath = path.join(__dirname, './public');
app.use('/public', express.static(publicPath));

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// ROUTES -----------------------------------------
app.get('/', ProjetoController.listar);

app.get('/home', ProjetoController.listar2);

app.get('/projeto/:id', ProjetoController.detalheProjeto);

app.post('/projeto/criar', ProjetoController.criar);

app.get('/projeto/:id/funcionalidades', ProjetoController.listarFuncionalidades);

app.post('/projeto/:id/funcionalidade/criar', FuncionalidadeController.criar);


// AJAX -------------------------------------------------------------

app.get('/listar_projetos', ProjetoController.recuperarProjetos);

app.get('/grafico', GraficoController.mostrar);

app.get('/dados_grafico_projeto/:id_projeto', GraficoController.gerarGrafico);

// -------------------------------------------------------------
app.use('/public', express.static('public'))

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');