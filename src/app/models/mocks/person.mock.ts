import { faker } from "@faker-js/faker";

import { Person } from "@models/person.model";

export const generateOnePerson = (): Person => {
  return new Person(
    faker.datatype.number(),
    faker.name.firstName(),
    faker.name.lastName(),
    faker.datatype.number({
      min: 0,
      max: 100,
    }),
    faker.datatype.number({ min: 30, max: 250, precision: 0.01 }),
    faker.datatype.number({ min: 0.5, max: 2, precision: 0.1 }),
  );
}

export const generateManyPeople = (amount = 5): Person[] => {
  return Array.from({ length: amount }, () => generateOnePerson());
}
