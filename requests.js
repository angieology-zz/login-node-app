const axios = require('axios');
var randomUsername = require('random-username-generator');

const gcpBaseUrl = 'http://104.154.229.172';
const localBaseUrl = 'https://localhost:3000';

const data = {
    "$class": "org.nobul.biznet.contracts.buyerAgreement",
    "agreementId": randomUsername.generate(),
    "brokerage": "string",
    "brokeragePhone": "string",
    "brokerageAddress": "string",
    "brokerageFax": "string",
    "buyerName": [],
    "propertyType": "string",
    "geographicLocation": "string",
    "commenceDate": "2018-06-15T17:27:54.668Z",
    "expireDate": "2018-06-15T17:27:54.668Z",
    "signBuyer": "string",
    "signDate": "2018-06-15T17:27:54.668Z",
    "signAddress": "string",
    "signTel": "string",
    "signFax": "string",
    "brokerName": "string",
    "brokerDate": "2018-06-15T17:27:54.668Z",
    "cashback": 0,
    "state": "INITIATED"
  }

  function getBuyer() {

      axios.get(gcpBaseUrl + '/api/org.nobul.biznet.contracts.buyerAgreement')
          .then(response => {
              console.log(response);
          })
          .catch(error => {
              console.log(error);
          });
  }
  

function postBuyer(buyerData) {
   
    axios.post(gcpBaseUrl + '/api/org.nobul.biznet.contracts.buyerAgreement', buyerData)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
}
  //postBuyer(data);
  getBuyer();

  //with https