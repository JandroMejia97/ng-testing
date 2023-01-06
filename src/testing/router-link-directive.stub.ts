/* eslint-disable @angular-eslint/directive-class-suffix */
import { Directive, HostListener, Input } from "@angular/core";

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: string | string[] | null = null;
  navigatedTo: string | string[] | null = null;

  @HostListener('click')
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
