const axios = require("axios")
require('dotenv').config()

let baseUrl = `https://api.opencorporates.com/v0.4.8`

//  officers/search?q=ivanka trump&jurisdiction_code=us_fl

const ocQuery = async (req , res) => {

    let iPath = req.body.url.split('%20').join(' ')
    let uri = `${baseUrl}${iPath}&api_token=dKLsNcqx1EySjmdcsU0C`

    console.log(`Link : ${uri}`)

    var config = {
        method: 'get',
        url: uri,
    }

try {
  const resp = await axios(config)
  console.log(`api resp : ${resp.data}`)
  return res.send(resp.data)
} catch (ex) {
     console.log(`error: ${ex}`)
}

}

module.exports = ocQuery
