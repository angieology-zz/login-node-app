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
    } catch (error) {
        console.log(error);
    }
}



// let factory = businessNetworkDefinition.getFactory();
// owner = factory.newResource('net.biz.digitalPropertyNetwork', 'Person', 'PID:1234567890');
// owner.firstName = 'Fred';
// owner.lastName = 'Bloggs';
// //add the person
// //'participant' the getParticipantRegistry API is used
// let personRegistry = await this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
// await personRegistry.add(owner);

    async function addUser() {
        try {
            let businessNetworkDefinition = await businessNetworkConnection.connect(cardName);

            let factory = businessNetworkDefinition.getFactory();
            customer = factory.newResource('org.nobul.biznet.participant', 'Customer', 'PID:1234206981');
            console.log("#############");
            let participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.nobul.biznet.participant.Customer');
         
            // // Create a new relationship to the vehicle.
            // var contact = factory.newConcept('Angela', 'Lee', 'test@nobul.com');
            // // Add the record to the persons array of records.
            // customer.Contact.push(contact);
            customer.fName = 'Angela';
            customer.lName = 'Lee';
            customer.email = 'test@nobul.com'
         
            participantRegistry.add(customer);
           await businessNetworkConnection.disconnect();
        } catch(error) {
            console.log(error);
            process.exit(1);
        }
    }


  

    addUser();