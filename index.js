/**
 * Express middlewares:
 * express-fileupload for handling card upload
 * cors - cross domain API support
 * body-parser - parse payload sent in body of HTTP requests
 * 
 */



const express = require('express')
const app = express()
const MyNetwork = require('./lib/MyNetwork');

const fileUpload = require('express-fileupload');
var cors = require('cors');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors({
    origin: ['<DOMAIN1>', '<DOMAIN2>'],
    credentials: true,
}));

//...
app.post('/api/login', function (req, res) {
    MyNetwork.importCardToNetwork(req.files.card.data).then(function (idCardName) {
        if (!idCardName) {
            res.status(403).json({ message: "Logging failed" });
        }
        res.json({ message: "Logging Successful", accessToken: idCardName })
    }).catch(function (error) {
        res.status(403).json({ message: "Login failed", error: error.toString() })
    })
})
app.post('/api/ping', function (req, res) {
    var cardName = req.headers.authorization;
    var mynetwork = new MyNetwork(cardName);
    mynetwork.init().then(function () {
        return mynetwork.ping()
    }).then(function (userInfo) {
        res.json({ user: userInfo })
    }).catch(function (error) {
        res.status(500).json({ error: error.toString() })
    })
})
app.post('/api/logout', function (req, res) {
    var cardName = req.headers.authorization;
    var mynetwork = new MyNetwork(cardName);
    mynetwork.init().then(function () {
        return mynetwork.logout()
    }).then(function () {
        res.json({ message: "User added Successfully" });
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({ error: error.toString() })
    })
})

//issue identity to participant
//
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

async function identityIssue() {
    let businessNetworkConnection = new BusinessNetworkConnection();
    try {
        await businessNetworkConnection.connect('admin@digitalPropertyNetwork');
        let result = await businessNetworkConnection.issueIdentity('net.biz.digitalPropertyNetwork.Person#mae@biznet.org', 'maeid1')
        console.log(`userID = ${result.userID}`);
        console.log(`userSecret = ${result.userSecret}`);
        await businessNetworkConnection.disconnect();
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
}

identityIssue();

//test connection as a user
async function testConnection() {
    let businessNetworkConnection = new BusinessNetworkConnection();
    try {
        await businessNetworkConnection.connect('admin@digitalPropertyNetwork');
        let result = await businessNetworkConnection.ping();
        console.log(`participant = ${result.participant ? result.participant : '<no participant found>'}`);
        await businessNetworkConnection.disconnect();
    } catch((error) {
        console.error(error);
        process.exit(1);
    }
}

testConnection();