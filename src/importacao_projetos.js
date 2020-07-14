// import projetos from './dados/projetos';
// import Repositorio from "./repositorio";
// import { GraficoService } from './services';
// import StatusProjeto from './dados/status-projeto';

// async function importarProjetos() {

//     console.log('Iniciando importação de projetos')

//     const projetosImportados = Repositorio.getAll(Repositorio.Entities.Projetos)
//     const idsImportados = projetosImportados.map(p => p.id) || []

//     console.log('idsImportados', idsImportados)

//     const projetosNaoImportados = projetos.filter((projeto) => {
//         return !idsImportados.includes(projeto.id)
//     })

//     console.log('projetosNaoImportados', projetosNaoImportados.map(p => p.id))

//     for (const projeto of projetosNaoImportados) {
//         const projetoInserido = await Repositorio.insert(Repositorio.Entities.Projetos, projeto)

//         if(projeto.status.id != StatusProjeto.ativo.id){
//             const dadosGrafico = await GraficoService.gerarBurningDown(projeto)
//             await Repositorio.updateById(Repositorio.Entities.Projetos, projeto.id, {...projeto, dadosGrafico})
//         }
//     }

//     console.log('Os projetos foram importados com sucesso')

// }

// importarProjetos();