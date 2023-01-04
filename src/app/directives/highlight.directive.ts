import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective {
  readonly defaultColor = 'red';

  @Input()
  set highlight(color: string) {
    if (color.length == 0) {
      color = this.defaultColor;
    }
    this.elementRef.nativeElement.style.backgroundColor = color;
  }

  constructor(
    private elementRef: ElementRef,
  ) {
    this.elementRef.nativeElement.style.backgroundColor = this.defaultColor;
  }

}
