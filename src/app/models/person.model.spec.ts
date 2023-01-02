import { IMC } from '@enums/imc.enum';
import { faker } from '@faker-js/faker';
import { Person } from './person.model';

describe('Person', () => {
  let person: Person;
  const id = 1;
  const name = 'John';
  const lastName = 'Doe';
  const age = faker.datatype.number({
    min: 0,
    max: 100,
  });
  const height = faker.datatype.number({ min: 0.5, max: 2, precision: 0.1 });
  const weight = faker.datatype.number({ min: 30, max: 250, precision: 0.01 });

  beforeEach(() => {
    person = new Person(id, name, lastName, age, weight, height);
  });

  it('should create an instance', () => {
    expect(person).toBeTruthy();
  });

  describe('calculateIMC', () => {
    it('should return 0 when height is equal or lower than 0', () => {
      person.height = 0;
      const imc = person.calculateIMC();
      expect(imc).toBe(0);
    });

    it(`should return 24.22 when height is 1.7 and weight is 70`, () => {
      person.height = 1.7;
      person.weight = 70;

      const expectedIMC = Math.round((70 / (1.7 * 1.7)) * 100) / 100;
      const imc = person.calculateIMC();
      expect(imc).toBe(expectedIMC);
    });

    it(`should return 0 when height is 0 and weight is 70`, () => {
      person.height = 0;
      person.weight = 70;

      const imc = person.calculateIMC();
      expect(imc).toBe(0);
    });

  });

  describe('castIMCToString', () => {
    it(`should return ${IMC.UNDERWEIGHT} when IMC is 17`, () => {
      person.height = 1.7;
      person.weight = 50;

      const imcString = person.castIMCToString();

      expect(imcString).toBe(IMC.UNDERWEIGHT);
    });

    it(`should return ${IMC.NORMAL} when IMC is 24`, () => {
      person.height = 1.7;
      person.weight = 70;

      const imcString = person.castIMCToString();

      expect(imcString).toBe(IMC.NORMAL);
    });

    it(`should return ${IMC.OVERWEIGHT} when IMC is 27`, () => {
      person.height = 1.7;
      person.weight = 76;

      const imcString = person.castIMCToString();

      expect(imcString).toBe(IMC.OVERWEIGHT);
    });

    it(`should return ${IMC.OVERWEIGHT_LEVEL_1} when IMC is 29`, () => {
      person.height = 1.7;
      person.weight = 85;

      const imcString = person.castIMCToString();

      expect(imcString).toBe(IMC.OVERWEIGHT_LEVEL_1);
    });

    it(`should return ${IMC.OVERWEIGHT_LEVEL_2} when IMC is 29`, () => {
      person.height = 1.7;
      person.weight = 88;

      const imcString = person.castIMCToString();
      expect(imcString).toBe(IMC.OVERWEIGHT_LEVEL_2);
    });

    it(`should return ${IMC.OBESE} when IMC is 45`, () => {
      person.height = 1.7;
      person.weight = 130;

      const imcString = person.castIMCToString();
      expect(imcString).toBe(IMC.OBESE);
    });

  });
});
