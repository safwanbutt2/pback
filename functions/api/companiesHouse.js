const axios = require("axios")
const environment = require('dotenv')
const baseUrl = `https://api.companieshouse.gov.uk`
environment.config()

const Query = async (link) => {
    let uri = `${baseUrl}/${link}`
    console.log(`Link : ${uri}`)

    var config = {
        method: 'get',
        url: uri,
        headers: {
            'Authorization': process.env.COMPANIES_HOUSE_TOKEN
        }
    }
    const resp = await axios(config)
    return resp.data
}


const searchCompany = async (req, res) => {
    if (!req.body.name) return res.status(400).send({ Error: 'Missing param name' })
    return res.send(await Query(`search/companies?q=${req.body.name}`))
}


const searchOfficer = async (req, res) => {
    if (!req.body.name) return res.status(400).send({ Error: 'Missing param name' })
    return res.send(await Query(`search/officers?q=${req.body.name}`))
}

const getOfficersInCompany = async (req, res) => {
    if (!req.body.id) return res.status(400).send({ Error: 'Missing param id' })
    return res.send(await Query(`company/${req.body.id}/officers`))
}

const getCompaniesByOfficer = async (req, res) => {
    if (!req.body.id) return res.status(400).send({ Error: 'Missing param id' })
    return res.send(await Query(`officers/${req.body.id}/appointments`))
}


var relations = []
const findRelationships = async (req, res) => {

    let info = req.body.info
    let entity1 = info[0]
    let entity2 = info[1]

    // items : entity1.data | type : entity1.entityType

    if (entity1.entityType === 'Company' && entity2.entityType === 'Company') findRelatedOfficers(entity1, entity2, info)
    if (entity1.entityType === 'Officer' && entity2.entityType === 'Officer') findRelatedCompanies(entity1, entity2, info)

    if (entity1.entityType === 'Company' && entity2.entityType === 'Officer') return res.send(await findOfficerInCompany(entity2, entity1, info))
    if (entity1.entityType === 'Officer' && entity2.entityType === 'Company') return res.send(await findOfficerInCompany(entity1, entity2, info))

}

const findRelatedOfficers = async (company1, company2, info) => {

    // company1 : get : https://api.companieshouse.gov.uk/company/12749836/officers
    // let company has links.self

    console.log(`selected company officers link : ${company1.selectedItem.links.self.substring(1)}`)

    var officerSet1 = await Query(`${company1.selectedItem.links.self.substring(1)}/officers`)
    var officerSet2 = await Query(`${company2.selectedItem.links.self.substring(1)}/officers`)

    info.relatedOfficers1 = officerSet1
    info.relatedOfficers2 = officerSet2

    return info
}

const commonOfficers = (officerSet1, officerSet2) => {
    var commons = []
    officerSet1.map((officer) => {
        officerSet2.map((officer2) => {
            if (officer.name === officer2.name) commons.push(officer)
        })
    })

}

const findRelatedCompanies = async (officer1, officer2, info) => {

    console.log(`find Related Companies `)

    await Query(officer1.selectedItem.link.self.substring(1))

    // Query (yreuQ)

    // officer1Data : officer1.links.self : /officers/we8o7eP7Ic6oJKX9XQ1oINn7NgM/appointments
    // officer2Data : officer1.links.self : /officers/we8o7eP7Ic6oJKX9XQ1oINn7NgM/appointments

    // company = officer1Data.links.company

    // check if officerData.links.company is same

}


const findOfficerInCompany = async (officers, companies, info) => {
    // console.log(`find Officers in company`)
    // console.log(`companies ${JSON.stringify(companies.data.items)}`)

    var Officers = markSelected(officers)
    // var Companies = markSelected(companies)

    var relatedCompanies = Officers.data.items.map(async (item) => {
        if (item.selected) {
            console.log(`find Officer's relation with company : found Selected officer`)
            var relatedOrgs = await findDirectRelation(item.links.self)
            console.log(``)

            info[0].officerRelations = { officer: item, relatedCompanies: relatedOrgs }
            info[1].officerRelations = { officer: item, relatedCompanies: relatedOrgs }
            return info
        }
        return {}
    })
    await Promise.all(relatedCompanies)


    var relatedOfficers = companies.data.items.map(async (item) => {
        if (item.selected) {
            console.log(`find Company's relation with Officer : found Selected company`)
            var relatedOfficers = await findCompanyOfficers(`${item.links.self}/officers`)
            info[0].companyRelations = { company: item, relatedOfficers: relatedOfficers }
            info[1].companyRelations = { company: item, relatedOfficers: relatedOfficers }
            return info
        }
        return {}
    })
    await Promise.all(relatedOfficers)

    console.log(`companyRelations : ${info[0].companyRelations}`)

    return info

   }



const findCompanyOfficers = async (officersLink) => {
    var refinedOfficersLink = officersLink.substring(1, officersLink.length)
    var officers = await Query(refinedOfficersLink)
    return officers.items

}

const findDirectRelation = async (link) => {
    var refinedLink = link.substring(1, link.length)
    console.log(`link:  ${refinedLink}`)
    var data = await Query(refinedLink)
    console.log(`data on link :: ${data}`)

    var relatedOrgs = data.items.map(async (appointment) => {
        let orgLink = appointment.links.company
        let filterLink = orgLink.substring(1, orgLink.length)
        return await Query(filterLink)
    })

    var companiesInfo = await Promise.all(relatedOrgs)
    return companiesInfo
}


const markSelected = (entity) => {

    var Index = 0
    entity.data.items.forEach((item, index) => {
        if (item.title === entity.selectedItem.title) {
            Index = index
            item.selected = true
            console.log('markSelected: Found Selected Item')
        }
    })

    console.log(`check : ${entity.data.items[Index].selected}`)
    return entity
}


const searchOfficerInAllCompanies = (officer) => {

}

const getCompanyData = async (company) => {
    let link = company.links.self.substring(1, company.links.self.length)
    var data = await Query(`${link}/officers`)
    console.log(`data : ${data}`)
    return data
}


const bigIteration = () => {
    // var officersInCompanies = companies.data.items.map((company) => {
    //     return getCompanyData(company)
    // })

    // var list = await Promise.all(officersInCompanies)


    // for each officer :: iterate over companies data ::  one of company officers is officer.name ?

    // console.log(JSON.stringify(officers.data.items[0]))

    // officers.data.items.forEach((officer) => {
    //     list.forEach((company) => {
    //         company.items.forEach((companyOfficer) => {
    //             console.log(`${officer.title} == ${companyOfficer.name}`)
    //             if (officer.title == companyOfficer.name) {
    //                 relations.push({ company: company, officer: officer })
    //                 console.log(`found a relation `)
    //                 console.log(JSON.stringify(relations))
    //             }
    //         })

    //     })
    // })

    // return relations

}

module.exports = {
    searchCompany,
    searchOfficer,
    getOfficersInCompany,
    getCompaniesByOfficer,
    findRelationships
}
