
import _ from "lodash";
import express from 'express';
import mustacheExpress from 'mustache-express';
import mustache from 'mustache';
import path from 'path';
import bodyParser from 'body-parser'

import GraficoController from './controllers/grafico.controller';

import { ProjetoController, FuncionalidadesController } from "./controllers";
import ViewsProjetoController from "./controllers/views-projeto.controller";
import MaintenanceController from "./controllers/maintenance.controller";
import PessoasController from "./controllers/pessoas.controller";
import Jobs from "./jobs";

var schedule = require('node-schedule');

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

app.get('/projeto/new', ViewsProjetoController.create);

app.get('/projeto/:id', ProjetoController.show);
app.post('/projeto/new', ProjetoController.store);
app.put('/projeto/:id', ProjetoController.update);

app.get('/projeto/:id/funcionalidades', FuncionalidadesController.index);
app.post('/projeto/:id/funcionalidade/criar', FuncionalidadesController.store);

app.get('/maintenance', MaintenanceController.index);
app.get('/maintenance/:id', MaintenanceController.show)


app.get('/pessoas', PessoasController.index);

// AJAX -------------------------------------------------------------

app.get('/listar_projetos', ProjetoController.index);

app.get('/grafico', GraficoController.mostrar);

app.get('/dados_grafico_projeto/:id_projeto', GraficoController.gerarGraficoProjeto);

app.get('/dados_grafico_manutencao/:id_quadro', GraficoController.gerarGraficoManutencao);

// -------------------------------------------------------------
app.use('/public', express.static('public'))

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');


let ruleSalvar = new schedule.RecurrenceRule();
ruleSalvar.minute = 30;

let jSalvar = schedule.scheduleJob(ruleSalvar, () => { 
    console.warn(new Date().toUTCString(), 'SalvarDadosManutencao')
    Jobs.SalvarDadosManutencao()
});


// let ruleArquivar = new schedule.RecurrenceRule();
// ruleArquivar.hour = 0;
// ruleArquivar.dayOfWeek = 0;

// let jArquivar = schedule.scheduleJob(ruleArquivar, () => { 
//     console.warn(new Date().toUTCString(), 'SalvarDadosManutencao')
//     Jobs.SalvarDadosManutencao()
// });

