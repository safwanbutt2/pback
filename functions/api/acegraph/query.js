const axios = require("axios")
const baseUrl = `https://api.companieshouse.gov.uk`


const Query = async (link) => {

    let uri = `${baseUrl}${link}`

    console.log(`Link : ${uri}`)

    var config = {
        method: 'get',
        url: uri,
        headers: {
            'Authorization': "8ppI7i2BxRXU6sTP1p1a1L327etfq5RwG6m6BTjD"
        }
    }

    const resp = await axios(config)
    return resp.data
}

module.exports = Query
