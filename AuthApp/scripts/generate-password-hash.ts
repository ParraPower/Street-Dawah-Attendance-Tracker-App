import { PasswordService } from '../src/domains/password/password-service';

const password = process.argv[2];
if (!password) {
    console.error('Please provide a password as an argument');
    process.exit(1);
}

const passwordService = new PasswordService();

passwordService.generatePasswordHash(password).then((hashedPassword) => {
    console.log('Hashed Password:', hashedPassword);
});