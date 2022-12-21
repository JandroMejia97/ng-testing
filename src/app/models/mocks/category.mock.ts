import { faker } from '@faker-js/faker';

import { Category } from '@models/category.model';

export const generateOneCategory = (): Category => {
  return {
    id: faker.datatype.number(),
    name: faker.commerce.department(),
  };
};

export const generateManyCategories = (count = 10): Category[] => {
  return [...Array.from({ length: count }, () => generateOneCategory())];
};
