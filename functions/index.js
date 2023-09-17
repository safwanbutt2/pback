const functions = require("firebase-functions")
const express = require("express")
const cors = require("cors")
const router = require('./api/router.js')

const app = express();
app.use(cors());


// app.get('/test', (req, res) => {
//     res.send('You did it! 🥳');
// })


app.use('/', router)


const api = functions.https.onRequest(app);

module.exports = {api}



