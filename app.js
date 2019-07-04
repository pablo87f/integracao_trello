var _ = require('lodash')

const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const mustache = require('mustache')
const path = require('path');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './views');

let projetos = require('./dados/projetos')
let GraficoController = require('./controllers/grafico.controller')

app.get('/', function (req, res) {
    res.render('home/index.html', { 'projetos':  _.orderBy(projetos, 'status.id') })
});

app.get('/home', function (req, res) {
    res.render('home/index.html', { 'projetos': _.orderBy(projetos, 'status.id') })
});

app.get('/projeto/:id', function (req, res) {

    if (!req.params.id || isNaN(req.params.id)) res.sendStatus(401)

    let projeto = _.find(projetos, { id: parseInt(req.params.id) })

    if (!projeto) res.sendStatus(404)

    res.render('projeto/index.html', { 'projeto': projeto })
});

// -------------------------------------------------------------

app.get('/listar_projetos', function (req, res) {
    res.send(projetos)
});

app.get('/grafico', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/grafico.view.html'));
});

app.get('/dados_grafico_projeto/:id_projeto', function (req, res) {
    let id_projeto = req.params.id_projeto

    let projeto = _.find(projetos, { id: parseInt(id_projeto) })

    GraficoController.gerarBurningDown(projeto).then((dados) => {
        const nomeProjeto = projeto.nome

        res.send({ ...dados, nomeProjeto })
    }).catch(e => {
        console.warn('erro:', e, e.message)
        res.send('Falha ao executar')
    })
});

app.use('/public', express.static('public'))
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');