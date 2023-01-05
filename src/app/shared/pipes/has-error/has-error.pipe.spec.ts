import { FormControl } from '@angular/forms';
import { HasErrorPipe } from './has-error.pipe';

describe('HasErrorPipe', () => {
  let pipe: HasErrorPipe;
  let control: FormControl;

  beforeEach(() => {
    pipe = new HasErrorPipe();
    control = new FormControl();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false if the control isn\'t touched and doesn\'t have an error', () => {
    const hasErrorSpy = spyOn(control, 'hasError').and.returnValue(false);

    control.markAsUntouched();

    expect(pipe.transform(control, 'required')).toBeFalse();
    expect(hasErrorSpy).not.toHaveBeenCalled();
  });

  it('should return false if the control is touched and doesn\'t have an error', () => {
    const hasErrorSpy = spyOn(control, 'hasError').and.returnValue(false);

    control.markAsTouched();

    expect(pipe.transform(control, 'required')).toBeFalse();
    expect(hasErrorSpy).toHaveBeenCalledWith('required', undefined);
  });

  it('should return true if the control is touched and has an error', () => {
    const hasErrorSpy = spyOn(control, 'hasError').and.returnValue(true);

    control.markAsTouched();

    expect(pipe.transform(control, 'required')).toBeTrue();
    expect(hasErrorSpy).toHaveBeenCalledWith('required', undefined);
  });
});
