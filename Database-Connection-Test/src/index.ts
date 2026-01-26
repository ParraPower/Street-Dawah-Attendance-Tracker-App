import './setup-env';
import { AppDataSource } from './data-source';
import { User } from './entities/User';

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');
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
