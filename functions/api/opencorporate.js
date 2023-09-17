
const axios = require("axios")

const Query = (req, res) => {
    var config = {
        method: 'get',
        url: 'https://api.opencorporates.com/v0.4.8/officers/search?',
        headers: {
            'Authorization': 'Bearer'
        }
    }

    axios(config)
        .then((response) => {
            console.log(response.data);
            return res.send(response.data.results.officers)
        })
        .catch((error) => {
            console.log(error)
            return res.send(error)

        })
}
