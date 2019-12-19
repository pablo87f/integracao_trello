import _ from 'lodash'
import { LocalStorage } from 'node-localstorage'
let Repositorio = {}

let localStorage = null

if (typeof localStorage === "undefined" || localStorage === null) {
    localStorage = new LocalStorage('./repositorio');
}

// -----------------------------------------

Repositorio.Entities = {
    'Projetos': 'projetos',
    'Pessoas': 'pessoas',
    'Cargos': 'Cargos',
}

Repositorio.getAll = (entityName) => {
    return JSON.parse(localStorage.getItem(entityName))
}

Repositorio.setAll = (entityName, data) => {
    localStorage.setItem(entityName, JSON.stringify(data));
    return true
}

Repositorio.findById = (entityName, id) => {
    let allData = Repositorio.getAll(entityName)
    return _.find(allData, { id: id })
}

Repositorio.findByField = async (entityName, filedName, valueToFind) => {

}

Repositorio.insert = async (entityName, data) => {

    let allData = Repositorio.getAll(entityName)
    if (!allData) { allData = [] }

    let projetoExistente = _.find(allData, { id: data.id })
    if (projetoExistente) { throw Error('Já existe um projeto com o mesmo id') }

    let idsExistentes = allData.length > 0 ? allData.reduce((item) => item.id) : [0]
    let nextId = _.max(idsExistentes) + 1

    allData.push({ ...data, id: nextId })

    Repositorio.setAll(entityName, allData)
}

Repositorio.updateById = async (entityName, id, newData) => {
    let allData = Repositorio.getAll(entityName)
    let indexRegister = _.findIndex(allData, { id: id })
    allData[indexRegister] = newData
    Repositorio.setAll(allData)
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