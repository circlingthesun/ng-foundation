import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit,
  OnDestroy,
  trigger,
  state,
  style,
  transition,
  animate,
  HostListener
} from '@angular/core';

import {ModalDismissReasons} from './modal-dismiss-reasons';

@Component({
  selector: 'Ngf-modal-window',
  host: {
    '[class]': `
      "reveal" + (windowClass ? " " + windowClass : "") + (size ? ' modal-' + size : '')
    `,
    'role': 'dialog',
    'tabindex': '-1',
    'style': 'display: block; visibility: visible;',
    '(keyup.esc)': 'escKey($event)',
    '[@modal]': ''
  },
  template: `
    <ng-content></ng-content>
  `,
  animations: [
      trigger('modal', [
        transition('void => *', [
          style({ transform: 'scale3d(.3, .3, .3)' }),
          animate(100)
        ]),
        transition('* => void', [
          animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
      ])
  ]
})
export class NgfModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @Input() backdrop: boolean | string = true;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (!this.backdrop) {
      this.position();
    }
  }

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}

  position() {
    if (this.backdrop) {
      return;
    }

    const windowWidth = document.body.offsetWidth;
    const width = this._elRef.nativeElement.offsetWidth;
    const left = Math.round((windowWidth - width) / 2);
    this._renderer.setElementStyle(this._elRef.nativeElement, 'left', left + 'px');
  }

  escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() {
    this._elWithFocus = document.activeElement;
    this._renderer.setElementClass(document.body, 'is-reveal-open', true);

    if (!this.backdrop) {
      this._renderer.setElementStyle(this._elRef.nativeElement, 'position', 'fixed');
      this.position();
    }

  }

  ngAfterViewInit() {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      this._renderer.invokeElementMethod(this._elRef.nativeElement, 'focus', []);
    }
  }

  ngOnDestroy() {
    if (this._elWithFocus && document.body.contains(this._elWithFocus)) {
      this._renderer.invokeElementMethod(this._elWithFocus, 'focus', []);
    } else {
      this._renderer.invokeElementMethod(document.body, 'focus', []);
    }

    this._elWithFocus = null;
    this._renderer.setElementClass(document.body, 'is-reveal-open', false);
  }
}