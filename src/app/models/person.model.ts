import { IMC } from '@enums/imc.enum';

export class Person {
  id: number;
  name: string;
  age: number;
  lastName: string;
  weight: number;
  height: number;

  constructor(
    id: number,
    name: string,
    age: number,
    lastName: string,
    weight: number,
    height: number
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.lastName = lastName;
    this.weight = weight;
    this.height = height;
  }



  calculateIMC(): number {
    if (this.height <= 0) {
      return 0;
    }
    return Math.round((this.weight / (this.height * this.height)) * 100) / 100;
  }

  castIMCToString(): IMC {
    const imc = this.calculateIMC();
    if (imc >= 40) {
      return IMC.OBESE;
    } else if (imc >= 30) {
      return IMC.OVERWEIGHT_LEVEL_2;
    } else if (imc >= 27) {
      return IMC.OVERWEIGHT_LEVEL_1;
    } else if (imc >= 25) {
      return IMC.OVERWEIGHT;
    } else if (imc >= 18) {
      return IMC.NORMAL;
    } else if (imc >= 0) {
      return IMC.UNDERWEIGHT;
    }
    return IMC.NOT_DEFINED;
  }
}
