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
const { cardName } = require('./config');

//const fileUpload = require('express-fileupload');
var cors = require('cors');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// //app.use(fileUpload());
// app.use(cors({
//     origin: ['<DOMAIN1>', '<DOMAIN2>'],
//     credentials: true,
// }));


var port = process.env.PORT || 8082; 

var router = express.Router();           
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.post('/test', function(req,res){
    res.json({message: 'this is a post test'})
})

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);

router.post('/register', async function (req, res){
    try {
        let network = new MyNetwork(cardName);
        let userData = {
            ID : req.body.ID,
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email
        }
        network.registerCustomer(userData);//should get response succeed or fail
      
        res.json({ message: 'customer ' + JSON.stringify(userData) + ' was successfully added'})
      
     } catch (err) {
         res.send(err);
     }
   
})

app.post('/api/login', function (req, res) {
    // MyNetwork.importCardToNetwork(req.files.card.data).then(function (idCardName) {
    //     if (!idCardName) {
    //         res.status(403).json({ message: "Logging failed" });
    //     }
    //     res.json({ message: "Logging Successful", accessToken: idCardName })
    // }).catch(function (error) {
    //     res.status(403).json({ message: "Login failed", error: error.toString() })
    // })
})
app.post('/api/ping', function (req, res) {
    // var cardName = req.headers.authorization;
    // var mynetwork = new MyNetwork(cardName);
    // mynetwork.init().then(function () {
    //     return mynetwork.ping()
    // }).then(function (userInfo) {
    //     res.json({ user: userInfo })
    // }).catch(function (error) {
    //     res.status(500).json({ error: error.toString() })
    // })
})
app.post('/api/logout', function (req, res) {
    // var cardName = req.headers.authorization;
    // var mynetwork = new MyNetwork(cardName);
    // mynetwork.init().then(function () {
    //     return mynetwork.logout()
    // }).then(function () {
    //     res.json({ message: "User logged out Successfully" });
    // }).catch(function (error) {
    //     console.log(error);
    //     res.status(500).json({ error: error.toString() })
    // })
})

app.post('/api/registerCustomer', function (req, res) {
    // var cardName = req.headers.authorization;
    // var mynetwork = new MyNetwork(cardName);
    // mynetwork.init().then(function () {
    //     return mynetwork.register(req.body.user)
    // }).then(function () {
    //     res.json({ message: "User added Successfully" });
    // }).catch(function (error) {
    //     console.log(error);
    //     res.status(500).json({ error: error.toString() })
    // })
})

app.post('/api/registerAgent', function (req, res) {
    // var cardName = req.headers.authorization;
    // var mynetwork = new MyNetwork(cardName);
    // mynetwork.init().then(function () {
    //     return mynetwork.register(req.body.user)
    // }).then(function () {
    //     res.json({ message: "User added Successfully" });
    // }).catch(function (error) {
    //     console.log(error);
    //     res.status(500).json({ error: error.toString() })
    // })
})





