var _ = require('lodash')

let Repositorio = {}

let localStorage = null

if (typeof localStorage === "undefined" || localStorage === null) {
    LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./repositorio');
}

// -----------------------------------------

Repositorio.Entities = {
    'Projetos' : 'projetos',
    'Pessoas': 'Pessoas',
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
    return _.find(allData, {id: id} )
}

Repositorio.findByField =  async (entityName, filedName, valueToFind) => {

}

Repositorio.insert = async (entityName, data) => {
    
    let allData = Repositorio.getAll(entityName)
    
    if(!allData) {throw Error('Não foi possível encontrar a coleção de dados')  }
    
    let projetoExistente = _.find(allData, {id: data.id} )
    
    if(projetoExistente){ throw Error('Já existe um projeto com o mesmo id') }

    allData.push(data)
    Repositorio.setAll(entityName, allData)
}

Repositorio.updateById = async (entityName, id, newData) => {
    let allData = Repositorio.getAll(entityName)
    let indexRegister = _.findIndex(allData, {id: id} )
    allData[indexRegister] = newData
    Repositorio.setAll(allData)
}

Repositorio.deleteById = async (entityName, id) => {
    let allData = Repositorio.getAll(entityName)
    let indexRegister = _.findIndex(allData, {id: id} )
    if (indexRegister > -1) {
        allData.splice(indexRegister, 1);
    }
    Repositorio.setAll(entityName, allData)
}

module.exports = Repositorio
