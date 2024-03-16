import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]',
  standalone: true
})
export class AutofocusDirective {
  constructor(private hostElement: ElementRef) { }
  ngAfterViewInit() {
    console.log('AutofocusDirective', this.hostElement.nativeElement);
    this.hostElement.nativeElement?.focus?.()
  }
}
