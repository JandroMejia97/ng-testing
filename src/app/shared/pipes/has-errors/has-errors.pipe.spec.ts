import { FormControl } from '@angular/forms';
import { HasErrorsPipe } from './has-errors.pipe';

describe('HasErrorsPipe', () => {
  let pipe: HasErrorsPipe;
  let control: FormControl;
  beforeEach(() => {
    pipe = new HasErrorsPipe();
    control = new FormControl(null);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null if the control is pristine', () => {
    const result = pipe.transform(control);
    expect(result).toBeNull();
  });

  it('should return null if the control is disabled', () => {
    control.disable();
    const result = pipe.transform(control);
    expect(result).toBeNull();
  });

  it('should return false if the control is untouched', ()=> {
    control.markAsDirty();
    control.markAsUntouched();
    const result = pipe.transform(control);
    expect(result).toBeFalse();
  });

  it('should return false if the control has errors', () => {
    control.markAsDirty();
    control.setErrors({ required: true });
    const result = pipe.transform(control);
    expect(result).toBeFalse();
  });

  it('should return true if the control has errors and has been touched', () => {
    control.markAsDirty();
    control.markAsTouched();
    control.setErrors({ required: true });
    const result = pipe.transform(control);
    expect(result).toBeTrue();
  });
});
