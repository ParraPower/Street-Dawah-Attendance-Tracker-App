import './setup-env';
import { AppDataSource } from './data-source.js';
import { User } from './entities/User.js';

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    // Example: create a new user
    // const user = new User();
    // user.name = 'Ahmed';
    // user.email = 'ahmed@example.com';

    // await AppDataSource.manager.save(user);
    // console.log('User saved:', user);

    // // Example: fetch users
    // const users = await AppDataSource.manager.find(User);
    // console.log('All users:', users);
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:')
    if (error instanceof AggregateError) {
      for (const err of error.errors) {
        console.error(err);
      }
    } else {
      console.error(error);
    }
});
