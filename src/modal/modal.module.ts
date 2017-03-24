import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgfModalBackdrop} from './modal-backdrop';
import {NgfModalWindow} from './modal-window';
import {NgfModalStack} from './modal-stack';
import {NgfModal} from './modal.service';

export {NgfModal, NgfModalOptions} from './modal.service';
export {NgfModalRef, NgfActiveModal} from './modal-ref';
export {ModalDismissReasons} from './modal-dismiss-reasons';

@NgModule({
  declarations: [
  	NgfModalBackdrop,
  	NgfModalWindow
  ],
  entryComponents: [
  	NgfModalBackdrop,
  	NgfModalWindow
  ],
  // providers: [
  // 	NgfModal,
  // 	NgfModalStack
  // ]
})
export class NgfModalModule {
  static forRoot(): ModuleWithProviders {
  	return {
  		ngModule: NgfModalModule,
  		providers: [NgfModal, NgfModalStack]
  	};
  }
}