
import Repositorio from "./repositorio";

export async function separarProjetos() {

    console.log('Iniciando separação de projetos')

    const projetos = Repositorio.getAll(Repositorio.Entities.Projetos)

    let indexProjetos = {}

    projetos.map(async (p) => {
        const projeto = { ...p, versao: '1.0' }
        const nomeArquivo = `projeto.${projeto.id}.json`
        indexProjetos = { ...indexProjetos, [projeto.id]: nomeArquivo }
        await Repositorio.setItem(nomeArquivo, projeto)
    })

    const index = await Repositorio.getAll('index.projetos.json')
    await Repositorio.setAll('index.projetos.json', { ...index, ...indexProjetos })

    Object.keys(indexProjetos).map(async (id) => {
        await Repositorio.deleteById(Repositorio.Entities.Projetos, parseInt(id))
    })
}

separarProjetos();