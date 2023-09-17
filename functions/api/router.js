const express = require('express')
const router = express.Router()
const companiesHouse = require('./companiesHouse')
const acegraph = require('./acegraph/acegraph')
const Query = require('./Query')
const ocQuery = require('./ocQuery')
const csvData = require('./csvData/csv')
const test = require('./test.js')
// const {relationFinder} = require('./companiesHouse/companiesHouse2.js')

router.post('/searchOfficer', companiesHouse.searchOfficer)
router.post('/searchCompany', companiesHouse.searchCompany)
router.post('/officersInCompany', companiesHouse.getOfficersInCompany)
router.post('/companiesByOfficers', companiesHouse.getCompaniesByOfficer)
router.post('/findRelations', companiesHouse.findRelationships)

router.post('/relatedEntities', acegraph.relatedEntities)
router.post('/query', Query)
router.post('/ocQuery', ocQuery)
router.get('/csvtojson', csvData.toJson)

router.get('/test', test)

module.exports = router





