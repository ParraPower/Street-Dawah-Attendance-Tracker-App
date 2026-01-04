import { createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';

export const mapper = createMapper({
  //name: 'authMapper',
  strategyInitializer: classes(),
  //pluginInitializer: classes,
});

console.log('Mapper created:', mapper);


