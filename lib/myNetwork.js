const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const IdCard = require('composer-common').IdCard;
const CardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );;
const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;
const AdminConnection = require('composer-admin').AdminConnection;

var cardStore = new CardStore();
var businessNetworkCardStore = new BusinessNetworkCardStore();
var adminConnection = new AdminConnection();

class MyNetwork {
    constructor(cardName) {
        this.currentParticipantId;
        this.cardName = cardName;
        this.connection = new BusinessNetworkConnection();
    }
//this code is mixing promise and await, clean up
    static importCardToNetwork(cardData) {
        var _idCardData, _idCardName;
        var businessNetworkConnection = new BusinessNetworkConnection();
        return IdCard.fromArchive(cardData).then(function (idCardData) {
            _idCardData = idCardData;
            return BusinessNetworkCardStore.getDefaultCardName(idCardData)
        }).then(function (idCardName) {
            _idCardName = idCardName;
            return cardStore.put(_idCardName, _idCardData)
        }).then(function (result) {
            return adminConnection.importCard(_idCardName, _idCardData);
        }).then(function (imported) {
            if (imported) {
                return businessNetworkConnection.connect(_idCardName)
            } else {
                return null;
            }
        }).then(function (businessNetworkDefinition) {
            if (!businessNetworkDefinition) {
                return null
            }
            return _idCardName;
        })
    }
      //...
    init() {
        var _this = this;
        return this.connection.connect(this.cardName).then((result) => {
            _this.businessNetworkDefinition = result;
            _this.serializer = _this.businessNetworkDefinition.getSerializer()
        })
    }

    ping() {
        var _this = this;
        return this.connection.ping().then(function (result) {
            return result
        })
    }
    logout() {
        var _this = this;
        return this.ping().then(function () {
            return adminConnection.deleteCard(_this.cardName)
        })
    }

    registerCustomer(user) {
        var _this = this;
        return this.connection.connect(this.cardName).then((result)=> {
            _this.businessNetworkDefinition = result;
            let factory = _this.businessNetworkDefinition.getFactory();
            newUser = factory.newResource('org.nobul.biznet.participant', 'Customer', user.id);
            newUser.firstName = user.firstName;
            newUser.lastName = user.lastName;
            //add the person org.nobul.biznet.participant

            //'participant' the getParticipantRegistry API is used
            let personRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Customer');
            await personRegistry.add(owner);
        })
    }

    registerAgent(user) {
        var _this = this;
        return this.connection.connect(this.cardName).then((result)=> {
            _this.businessNetworkDefinition = result;
            let factory = _this.businessNetworkDefinition.getFactory();
            newUser = factory.newResource('org.nobul.biznet.participant', 'Agent', user.id);
            newUser.firstName = user.firstName;
            newUser.lastName = user.lastName;
            let personRegistry = await this.bizNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Agent');
            await personRegistry.add(owner);
        })
    }

    login() {
        //issue identity, if user is registered
        //todo check isRegistered
        async function identityIssue() {
            try {
                await businessNetworkConnection.connect('admin@digitalPropertyNetwork');
                console.log(`userID = ${result.userID}`);
                console.log(`userSecret = ${result.userSecret}`);
                await businessNetworkConnection.disconnect();
            } catch(error) {
                console.log(error);
                process.exit(1);
            }
        }
    }

    
}
