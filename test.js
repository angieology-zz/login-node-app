const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { cardName } = require('./config');


let businessNetworkConnection = new BusinessNetworkConnection();

function promiseConnect() {
    let businessNetworkDefinition;
    businessNetworkConnection.connect(cardName)
        .then((result) => {
            businessNetworkDefinition = result;
            console.log(result)
        });
}

async function asyncConnect() {
    try {
        let businessNetworkDefinition = await businessNetworkConnection.connect(cardName);
        console.log(businessNetworkDefinition)
        await businessNetworkConnection.disconnect();
    } catch (error) {
        console.log(error);
    }
}

async function addUser() {
    try {
        let businessNetworkDefinition = await businessNetworkConnection.connect(cardName);

        let factory = businessNetworkDefinition.getFactory();
        customer = factory.newResource('org.nobul.biznet.participant', 'Customer', 'PID:16981');
        console.log(customer)
        let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Customer');

        customer.fName = 'Angela';
        customer.lName = 'Lee';
        customer.email = 'test@nobul.com'

        participantRegistry.add(customer);
        await businessNetworkConnection.disconnect();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}




addUser();