import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ReversePipe } from './reverse.pipe';

@Component({
  template: `
    <p>
      {{ 'roma' | reverse }}
    </p>
    <p>
      <input type="text" [(ngModel)]="reverseText">
    </p>
    <p>
      {{ reverseText | reverse }}
    </p>
  `,
})
class HostComponent {
  reverseText = 'Reverse me!';
}

describe('ReversePipe', () => {
  let pipe: ReversePipe;

  describe('Tests without a HostComponent', () => {
    beforeEach(() => {
      pipe = new ReversePipe();
    });

    it('create an instance', () => {
      expect(pipe).toBeTruthy();
    });

    it('should reverse the string', () => {
      expect(pipe.transform('hello')).toBe('olleh');
    });

    it('should reverse the string with a number', () => {
      expect(pipe.transform('hello1')).toBe('1olleh');
    });
  });

  describe('Tests with a HostComponent', () => {
    let fixture: ComponentFixture<HostComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormsModule],
        declarations: [ReversePipe, HostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
    });

    it('should reverse the string "roma"', () => {
      const p = fixture.debugElement.query(By.css('p'));
      expect(p.nativeElement.textContent.trim()).toBe('amor');
    });

    it('should reverse the string "Reverse me!"', () => {
      const p = fixture.debugElement.queryAll(By.css('p'))[2];
      expect(p.nativeElement.textContent.trim()).toBe('!em esreveR');
    });

    it('should reverse the string "Reverse me!" when the input changes', () => {
      const input = fixture.debugElement.query(By.css('input'));
      const p = fixture.debugElement.queryAll(By.css('p'))[2];

      expect(p.nativeElement.textContent.trim()).toBe('!em esreveR');

      input.nativeElement.value = 'New reverse text';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(p.nativeElement.textContent.trim()).toBe('txet esrever weN');
    });
  });

});
