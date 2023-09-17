const axios = require("axios")
const Query = require("./Query")
require('dotenv').config()


class companiesHouse {

    constructor() {
        this.baseUrl = `https://api.companieshouse.gov.uk`
        this.depth = 1
        this.finalDepth = 2
        this.Json = {}
    }


    findRelationShips = async (entity1, entity2, info) => {
        this.Json = info
        this.finalDepth = info.finalDepth

        let company = entity1.entityType === 'Company' ? entity1 : entity2
        console.log(`entityType : ${company.entityType}`)

        let selectedCompany = company.data.items
            .map((item) => { return item.selected ? item : undefined })
            .filter(Boolean)[0]

        console.log(`selected company : ${selectedCompany}`)
        await this.recursionHandler(selectedCompany)
        return this.Json
    }


    recursionHandler = async (company, entityList) => {
        console.log('recursion Handler')
        if (this.depth === 1) this.Depth1(company)
        if (this.depth === 1) return
        if (entityList && this.depth !== this.finalDepth) this.recursionBase(entityList)
    }



    Depth1 = async (entity) => {
        console.log('Depth1')
        var queryResp = {}
        if (entity.company_number) queryResp = await Query(`${entity.links.self}/officers`)
        if (!entity.company_number) console.error('Depth 1 : Missing Attribute : company_number')

        this.Json[`depth${this.depth}`] = queryResp.items
        console.log(this.Json , undefined , 2)
        this.depth++
        return
        // this.recursionHandler(entity, queryResp.items)
    }


    recursionBase = async (entityList) => {
        console.log('recursion Base')

        var resultingEntityList = []

        if (entityList[0].links && entityList[0].links.officer) resultingEntityList = await this.companyToOfficers(entityList)
        if (!entityList[0].links.hasOwnProperty('officer')) {
            if (!entityList[0].links.company && entityList[0].links.officers) resultingEntityList = await this.officerToCompanies2(entityList)
            if (entityList[0].links.company) resultingEntityList = await this.officerToCompanies(entityList)
        }

        console.log(`Depth :: 1 && entityList :: ${entityList}`)

        this.Json[`depth${this.depth}`] = resultingEntityList

        this.recursionHandler({}, resultingEntityList)
    }


    companyToOfficers = async (entityList) => {
        const promiseList = entityList.map(async (item) => {
            let appointments = await Query(item.links.officer.appointments)
            return appointments.items[0]
        })

        return await Promise.all(promiseList)
    }


    officerToCompanies = async (entityList) => {
        const promiseList = entityList.map(async (item) => {
            let companies = await Query(item.links.company)
            return companies
        })

        return await Promise.all(promiseList)
    }

    officerToCompanies2 = async (entityList) => {
        const promiseList = entityList.map(async (item) => {
            let companies = await Query(item.links.officers)
            return companies.items
        })

        return await Promise.all(promiseList)
    }


}



const main = async (req, res) => {
    let info = req.body.info
    let companiesApi = new companiesHouse()

    let result = await companiesApi.findRelationShips(info[0], info[1], info)

    res.send('result')
}

module.exports = { main }