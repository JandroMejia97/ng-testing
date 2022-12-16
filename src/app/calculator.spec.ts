import { Calculator } from './calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Test for the \'multiply\' function', () => {
    it('should multiply two numbers', () => {
      const result = calculator.multiply(2, 3);
      expect(result).toBe(6);
    });

    it('should return zero when multiply by zero', () => {
      const result = calculator.multiply(2, 0);
      expect(result).toBe(0);
    });
  });

  describe('Test for the \'divide\' function', () => {
    it('should divide two numbers', () => {
      const result = calculator.divide(6, 3);
      expect(result).toBe(2);
    });

    it('should return null when dividing by zero', () => {
      const result = calculator.divide(6, 0);
      expect(result).toBeNull();
    });
  })

});
