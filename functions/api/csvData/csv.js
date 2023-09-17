const config = require('../config')
const csv = require('csvtojson')
const firebase = require('firebase/compat/app')
require('firebase/compat/auth')
require('firebase/compat/database')

class csvProcessor {

    constructor() {
        this.x = 1
    }


    anonymousLogin = async () => {
        const response = await firebase.auth().signInAnonymously();
        const Id = response.user.uid
        console.log(Id)
        return { userId: Id }
    }

    toDatabase = async (deca, section) => {
        var promises = deca.map(async (item, index) => {
            console.log(`pushing item ${index}`)
            return await firebase.database().ref(`/csvData/section${section}`).push({ ...item })
        })
        await Promise.all(promises)
        return 200
    }

    toJson = async (req, res) => {

        firebase.initializeApp(config)

        await this.anonymousLogin()

        const csvFilePath = `${__dirname}/ukEntities.csv`
        const bigData = await csv().fromFile(csvFilePath)

        var section = 6
        var thousand = []

        bigData.forEach((item, index) => {
            if (index > (section * 1000) && index <= ((section + 1) * 1000)) thousand.push(item)
        })

        await this.toDatabase(thousand, section + 1)

        return res.status(200).send({ status: 200, message: 'success', range: `${section} - ${section + 1}` })


    }

}

module.exports = new csvProcessor()



