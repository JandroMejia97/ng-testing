export class Calculator {
  multiply(a: number, b: number): number {
    return a * b;
  }


  divide(a: number, b: number): number | null {
    return b === 0 ? null : (a / b);
  }

}
