import projetos from './dados/projetos';
import Repositorio from "./repositorio";

async function importarProjetos() {

    console.log('Iniciando importação de projetos')

    const projetosImportados = Repositorio.getAll(Repositorio.Entities.Projetos)
    const idsImportados = projetosImportados.map(p => p.id) || []

    console.log('idsImportados', idsImportados)

    const projetosNaoImportados = projetos.filter((projeto) => {
        return !idsImportados.includes(projeto.id)
    })

    console.log('projetosNaoImportados', projetosNaoImportados.map(p => p.id))

    for (const projeto of projetosNaoImportados) {
        await Repositorio.insert(Repositorio.Entities.Projetos, projeto)
    }

    console.log('Os projetos foram importados com sucesso')

}

importarProjetos();