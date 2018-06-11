const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
//const IdCard = require('composer-common').IdCard;
//const CardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );;
//const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;
//const AdminConnection = require('composer-admin').AdminConnection;

//var cardStore = new CardStore();
//var businessNetworkCardStore = new BusinessNetworkCardStore();
//var adminConnection = new AdminConnection();

module.exports = class MyNetwork {
    constructor(cardName) {
        this.currentParticipantId;
        this.cardName = cardName;
        this.connection = new BusinessNetworkConnection();
    }
    
    async registerCustomer(userData) {
        try {
            var _this = this;
            let businessNetworkDefinition = await this.connection.connect(this.cardName);
    
            let factory = businessNetworkDefinition.getFactory();
           
            let customer = factory.newResource('org.nobul.biznet.participant', 'Customer', userData.ID);

            let contact = factory.newConcept('org.nobul.biznet.participant', 'Concept');
            { 
                contact.fName, 
                contact.lName, 
                contact.email 
            } = userData;

            console.log(JSON.stringify(contact))

            customer.contact = contact;

            let participantRegistry = await this.connection.getParticipantRegistry('org.nobul.biznet.participant.Customer');
    
    
            participantRegistry.add(customer);
           
            //todo this doesn't disconnect...
            await this.connection.disconnect();


        } catch (error) {
            console.log(error)
        }
    }

    async registerAgent(userData) {
        try {
            var _this = this;
            let businessNetworkDefinition = await this.connection.connect(this.cardName);
    
            let factory = businessNetworkDefinition.getFactory();
            
            let agent = factory.newResource('org.nobul.biznet.participant', 'Agent', userData.ID);
          
            let participantRegistry = await this.connection.getParticipantRegistry('org.nobul.biznet.participant.Agent');
    
            agent.fName = userData.fName;
            agent.lName = userData.lName;
            agent.email = userData.email;
            agent.license = userData.license;
    
            participantRegistry.add(customer);
           
            //todo this doesn't disconnect...
            await this.connection.disconnect();


        } catch (error) {
            console.log(error)
        }
    }

    async createAgreement() {
        try {
            var _this = this;
            let businessNetworkDefinition = await this.connection.connect(this.cardName);
    
            let factory = businessNetworkDefinition.getFactory();

            // concept Irrevocability{
            //     o String responsibleSide
            //     o DateTime timeline
            // }

            let irrevocability = factory.newConcept('org.nobul.biznet.contracts', 'Irrevocability');
            irrevocability.responsibleSide = '';
            irrevoability.timeline = new Date();
            
        
            
            // concept Notices {
            //     o String buyerFax
            //     o String sellerFax
            //     o String buyerEmail
            //     o String sellerEmail
            // }

            let notices = factory.newConcept('org.nobul.biznet.contracts', 'Notices');
            notices.buyerFax = '';
            notices.sellerFax = '';
            notices.buyerEmail = '';
            notices.sellerEmail = '';




            //contract
            let contract = factory.newResource('org.nobul.biznet.contracts', 'PurchaseSaleAgreement', userData.ID);
          
            let assetRegistry = await this.connection.getAssetRegistry('org.nobul.biznet.contracts.PurchaseSaleAgreement');
    
            //need the array of participants, signatures

            contract.agreementId = '';
            contract.buyerName = [];
            contract.sellerName = [];
            contract.Signers = [];
            contract.signedDate = new Date();//factory.getDateTime
            contract.propertyAddress = '';
            contract.propertyDescription = '';
            contract.purchasePrice = double(0);
            contract.buyerDeposit = double(0);
            contract.irevocability = '';//factory new Irrevocability
            contract.completionDate = new Date();
            contract.notices = notices;//factory Notices
            contract.chattels = '';
            contract.fixtures = '';
            contract.rentalItems = '';
            contract.hst ='';
            contract.titleSearch = '';
            contract.sucessorsAndAssigns = '';
    
            assetRegistry.add(contract);
           
            //todo this doesn't disconnect...
            await this.connection.disconnect();


        } catch (error) {
            console.log(error)
        }
    }

    async signAgreement() {}

    async identityIssue() {//login
        try {
            await businessNetworkConnection.connect(this.cardName);
            console.log(`userID = ${result.userID}`);
            console.log(`userSecret = ${result.userSecret}`);
            await businessNetworkConnection.disconnect();
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }


}




// {
// //this code is mixing promise and await, clean up
//     static importCardToNetwork(cardData) {
//         var _idCardData, _idCardName;
//         var businessNetworkConnection = new BusinessNetworkConnection();
//         return IdCard.fromArchive(cardData).then(function (idCardData) {
//             _idCardData = idCardData;
//             return BusinessNetworkCardStore.getDefaultCardName(idCardData)
//         }).then(function (idCardName) {
//             _idCardName = idCardName;
//             return cardStore.put(_idCardName, _idCardData)
//         }).then(function (result) {
//             return adminConnection.importCard(_idCardName, _idCardData);
//         }).then(function (imported) {
//             if (imported) {
//                 return businessNetworkConnection.connect(_idCardName)
//             } else {
//                 return null;
//             }
//         }).then(function (businessNetworkDefinition) {
//             if (!businessNetworkDefinition) {
//                 return null
//             }
//             return _idCardName;
//         })
//     }
//       //...
//     init() {
//         var _this = this;
//         return this.connection.connect(this.cardName).then((result) => {
//             _this.businessNetworkDefinition = result;
//             _this.serializer = _this.businessNetworkDefinition.getSerializer()
//         })
//     }

//     ping() {
//         var _this = this;
//         return this.connection.ping().then(function (result) {
//             return result
//         })
//     }
//     logout() {
//         var _this = this;
//         return this.ping().then(function () {
//             return adminConnection.deleteCard(_this.cardName)
//         })
//     }

//     registerCustomer(user) {
//         var _this = this;
//         return this.connection.connect(this.cardName).then((result)=> {
//             _this.businessNetworkDefinition = result;
//             let factory = _this.businessNetworkDefinition.getFactory();
//             newUser = factory.newResource('org.nobul.biznet.participant', 'Customer', user.id);
//             newUser.firstName = user.firstName;
//             newUser.lastName = user.lastName;
//             //add the person org.nobul.biznet.participant

//             //'participant' the getParticipantRegistry API is used
//             let personRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Customer');
//             await personRegistry.add(owner);
//         })
//     }

//     registerAgent(user) {
//         var _this = this;
//         return this.connection.connect(this.cardName).then((result)=> {
//             _this.businessNetworkDefinition = result;
//             let factory = _this.businessNetworkDefinition.getFactory();
//             newUser = factory.newResource('org.nobul.biznet.participant', 'Agent', user.id);
//             newUser.firstName = user.firstName;
//             newUser.lastName = user.lastName;
//             let personRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Agent');
//             await personRegistry.add(owner);
//         })

        
//         this.businessNetworkDefinition = await businessNetworkConnection.connect(this.cardName);
//     }

//     login() {
//         //issue identity, if user is registered
//         //todo check isRegistered
//         async function identityIssue() {
//             try {
//                 await businessNetworkConnection.connect(this.cardName);
//                 console.log(`userID = ${result.userID}`);
//                 console.log(`userSecret = ${result.userSecret}`);
//                 await businessNetworkConnection.disconnect();
//             } catch(error) {
//                 console.log(error);
//                 process.exit(1);
//             }
//         }
//     }

    
// }
