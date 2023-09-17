const axios = require("axios")
const baseUrl = `https://api.companieshouse.gov.uk`


const Query = async (link) => {

    let uri = `${baseUrl}${link}`

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

module.exports = Query
