import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {
  private readonly defaultColor = 'red';

  @Input() highlight!: string;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.elementRef.nativeElement.style.backgroundColor = this.defaultColor;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['highlight'] && this.highlight.length > 0) {
      this.elementRef.nativeElement.style.backgroundColor = this.highlight ?? this.defaultColor;
    }
  }



}
