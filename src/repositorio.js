import _ from "lodash";
import { JSONStorage } from 'node-localstorage'
let Repositorio = {}

let localStorage = null

if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new JSONStorage('./repositorio');
}

// -----------------------------------------

Repositorio.Entities = {
    'Projetos': 'Projetos.json',
    'Pessoas': 'Pessoas',
    'Cargos': 'Cargos',
    'Funcionalidades': 'Funcionalidades',
}

Repositorio.getAll = (entityName) => {
    return localStorage.getItem(entityName) || []
}

Repositorio.setAll = (entityName, data) => {
    localStorage.setItem(entityName, data);
    return true
}

Repositorio.findById = (entityName, id) => {
    let allData = Repositorio.getAll(entityName)
    return _.find(allData, { id: parseInt(id) })
}

Repositorio.findByField = async (entityName, filedName, valueToFind) => {

}

Repositorio.insert = async (entityName, data) => {

    let allData = Repositorio.getAll(entityName)
    if (!allData) { allData = [] }

    if (data.id) {
        let projetoExistente = _.find(allData, { id: data.id })
        if (projetoExistente) { throw Error('Já existe um projeto com o mesmo id') }
    }
    else {
        let idsExistentes = allData.length > 0 ? allData.map((item) => item.id) : [0]
        data.id = Math.max.apply(Math, idsExistentes) + 1
    }

    allData.push({ ...data })

    Repositorio.setAll(entityName, allData)

    return data
}

Repositorio.updateById = async (entityName, id, newData) => {
    let allData = Repositorio.getAll(entityName)
    let indexRegister = _.findIndex(allData, { id: parseInt(id) })
    allData[indexRegister] = newData
    Repositorio.setAll(entityName, allData)
}

Repositorio.deleteById = async (entityName, id) => {
    let allData = Repositorio.getAll(entityName)
    let indexRegister = _.findIndex(allData, { id: id })
    if (indexRegister > -1) {
        allData.splice(indexRegister, 1);
    }
    Repositorio.setAll(entityName, allData)
}

module.exports = Repositorio

export default Repositorio
