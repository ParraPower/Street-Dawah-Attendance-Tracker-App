import { ClientService } from '../src/features/clients/domains/services/client-service'
import { BcryptHasherService } from 'app-framework';

// const password = process.argv[2];
// if (!password) {
//     console.error('Please provide a password as an argument');
//     process.exit(1);
// }

const hasherService = new BcryptHasherService();
const clientService = new ClientService(hasherService);

clientService.generateClientSecret().then((secret) => {
    console.log('Secret: ', secret);
    clientService.generateClientSecretHash(secret).then(hash => {
        console.log('Hash: ', hash)
    })
})