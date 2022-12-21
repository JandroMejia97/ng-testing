import { faker } from '@faker-js/faker';

import { Product } from '@models/product.model';
import { generateOneCategory } from './category.mock';

export const generateOneProduct = (): Product => {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    images: [faker.image.imageUrl(), faker.image.imageUrl()],
    category: generateOneCategory(),
  };
};

export const generateManyProducts = (count = 10): Product[] => {
  return [...Array.from({ length: count }, () => generateOneProduct())];
};
