const axios = require("axios")
const baseUrl = `https://api.companieshouse.gov.uk`
require('dotenv').config()

const Query = async (req , res) => {

   let uri = `${baseUrl}${req.body.url}`

    console.log(`Link : ${req.body.url}`)

    var config = {
        method: 'get',
        url: uri,
        headers: {
            'Authorization': '8ppI7i2BxRXU6sTP1p1a1L327etfq5RwG6m6BTjD'
        }
    }

try {
  const resp = await axios(config)
  console.log(`api resp : ${resp.data}`)
  return res.send(resp.data)

} catch (ex) {
     console.log(ex)
}

}

module.exports = Query
