import { faker } from '@faker-js/faker';

import { Product } from '@models/product.model';

export const generateOneProduct = (): Product => {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    images: [
      faker.image.imageUrl(),
      faker.image.imageUrl(),
    ],
    category: {
      id: faker.datatype.number(),
      name: faker.commerce.department(),
    }
  }
};

export const generateManyProducts = (count = 10): Product[] => {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push(generateOneProduct());
  }
  return [...products];
}
