
import _ from "lodash";
import express from 'express';
import mustacheExpress from 'mustache-express';
import mustache from 'mustache';
import path from 'path';
import bodyParser from 'body-parser'

import projetos from './dados/projetos';
import GraficoController from './controllers/grafico.controller';

import repo from './repositorio';

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

// -----------------------------------------
app.get('/', function (req: express.Request, res: express.Response) {
    res.render('./home/index.html', { 'projetosSalvos': _.orderBy(repo.getAll(repo.Entities.Projetos), ['status.id', 'id'], ['asc', 'desc']), 'projetos': _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc']) })
});

app.get('/home', function (req, res) {
    res.render('home/index.html', { 'projetosSalvos': _.orderBy(repo.getAll(repo.Entities.Projetos), ['status.id', 'id'], ['asc', 'desc']), 'projetos': _.orderBy(projetos, ['status.id', 'id'], ['asc', 'desc']) })
});

app.get('/projeto/:id', function (req: express.Request, res: express.Response) {

    if (!req.params.id) res.sendStatus(401);

    let idProjeto: number = 0

    try {
        idProjeto = parseInt(req.params.id);
    }
    catch (e) {
        res.sendStatus(401);
    }

    let projeto = _.find(projetos, { id: idProjeto })

    if (!projeto) res.sendStatus(404)

    res.render('projeto/index.html', { 'projeto': projeto })
});


app.post('/projeto/criar', function (req, res) {

    if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })

    if (!req.body.nome) res.status(400).send({ sucess: false, message: "Campo 'nome' é obrigatório" })

    if (!req.body.codigoQuadroTrello) res.status(400).send({ sucess: false, message: "Campo 'codigoQuadroTrello' é obrigatório" })

    let projeto = {
        nome: req.body.nome,
        idBoard: req.body.codigoQuadroTrello
    }

    repo.insert(repo.Entities.Projetos, projeto)

    res.send({ sucess: true })
});

app.get('/projeto/:id/funcionalidades', function (req: express.Request, res: express.Response) {

    if (!req.params.id) res.sendStatus(401);

    let idProjeto: number = 0

    try {
        idProjeto = parseInt(req.params.id);
    }
    catch (e) {
        res.sendStatus(401);
    }

    let projeto = _.find(projetos, { id: idProjeto })

    if (!projeto) res.sendStatus(404)

    const funcionalidades = repo.getAll(repo.Entities.Funcionalidades) || []

    res.render('projeto/funcionalidades/index.html', { 'projeto': projeto, 'funcionalidades': _.orderBy(funcionalidades, ['id'], ['desc']) })
});

app.post('/projeto/:id/funcionalidade/criar', function (req: express.Request, res: express.Response) {

    if (!req.params.id) res.sendStatus(401);

    let idProjeto: number = 0

    try {
        idProjeto = parseInt(req.params.id);
    }
    catch (e) {
        res.sendStatus(401);
    }

    if (!req.body) res.status(400).send({ sucess: false, message: 'Não foi possível recuperar corpo da requisição' })

    if (!req.body.descricao) res.status(400).send({ sucess: false, message: "Campo 'descricao' é obrigatório" })

    let funcionalidade = {
        descricao: req.body.descricao
    }

    repo.insert(repo.Entities.Funcionalidades, funcionalidade)

    res.send({ sucess: true })
});


// -------------------------------------------------------------

app.get('/listar_projetos', function (req, res) {
    res.send(projetos)
});

app.get('/grafico', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/grafico.view.html'));
});

app.get('/dados_grafico_projeto/:id_projeto', async function (req, res) {
    let id_projeto = req.params.id_projeto

    let projeto = _.find(projetos, { id: parseInt(id_projeto) })
    try {
        const dados = await GraficoController.gerarBurningDown(projeto)
        const nomeProjeto = projeto ? projeto.nome : "---"

        res.send({ ...dados, nomeProjeto })


    } catch (e) {
        console.warn('erro:', e, e.message)
        res.send('Falha ao executar')
    }
});

app.use('/public', express.static('public'))

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');