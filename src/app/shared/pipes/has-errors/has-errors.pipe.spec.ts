import { HasErrorsPipe } from './has-errors.pipe';

describe('HasErrorsPipe', () => {
  it('create an instance', () => {
    const pipe = new HasErrorsPipe();
    expect(pipe).toBeTruthy();
  });
});
