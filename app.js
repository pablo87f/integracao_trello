var _ = require('lodash')

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

let projetos = require('./dados/projetos')

let GraficoController = require('./controllers/grafico.controller')

router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.view.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/listar_projetos', function (req, res) {
    res.send(projetos)
});

router.get('/grafico', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/grafico.view.html'));
});

router.get('/dados_grafico_projeto/:id_projeto', function (req, res) {
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

//add the router
app.use('/', router);
app.use('/public', express.static('public'))
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');