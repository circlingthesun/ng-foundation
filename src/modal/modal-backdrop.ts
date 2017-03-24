import {
    Component,
    EventEmitter,
    ElementRef,
    Output,
    Input,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';

import {ModalDismissReasons} from './modal-dismiss-reasons';

@Component({
    selector: 'Ngf-modal-backdrop',
    template: '',
    host: {
        'class': 'reveal-overlay',
        'style': 'display: block;',
        '(click)': 'backdropClick($event)',
        '[@backdrop]': ''
    },
    animations: [
        trigger('backdrop', [
          transition('void => *', [
            style({ opacity: 0 }),
            animate(100, style({ opacity: 1 }))
          ]),
          transition('* => void', [
            style({ opacity: 1 }),
            animate(100, style({ opacity: 0 }))
          ])
        ])
    ]
})
export class NgfModalBackdrop {
    @Output('dismiss') dismissEvent = new EventEmitter();

    constructor(private _elRef: ElementRef) {

    }

    backdropClick($event): void {
        if ($event.target != this._elRef.nativeElement) {
            return;
        }
        this.dismissEvent.emit(ModalDismissReasons.BACKDROP_CLICK);
    }
}