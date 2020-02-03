
import _ from "lodash";
import express from 'express';
import mustacheExpress from 'mustache-express';
import mustache from 'mustache';
import path from 'path';
import bodyParser from 'body-parser'

import projetos from './dados/projetos';
import GraficoController from './controllers/grafico.controller';

import repo from './repositorio';
import { ProjetoController, FuncionalidadesController } from "./controllers";

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
app.get('/home', ProjetoController.index);
app.get('/', ProjetoController.index);

app.get('/projeto/:id', ProjetoController.show);
app.post('/projeto/criar', ProjetoController.store);
app.put('/projeto/:id', ProjetoController.update);

app.get('/projeto/:id/funcionalidades', FuncionalidadesController.index);
app.post('/projeto/:id/funcionalidade/criar', FuncionalidadesController.store);




// AJAX -------------------------------------------------------------

app.get('/listar_projetos', ProjetoController.index);

app.get('/grafico', GraficoController.mostrar);

app.get('/dados_grafico_projeto/:id_projeto', GraficoController.gerarGrafico);

// -------------------------------------------------------------
app.use('/public', express.static('public'))

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');