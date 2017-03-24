import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgfModalModule, NgfModal, NgfModalOptions, NgfModalRef, ModalDismissReasons} from './modal/modal.module';

export {
  NgfModalModule,
  NgfModal,
  NgfModalOptions,
  NgfActiveModal,
  NgfModalRef,
  ModalDismissReasons
} from './modal/modal.module';

const NGF_MODULES = [
  NgfModalModule
];

@NgModule({
  imports: [
    NgfModalModule.forRoot()
  ],
  exports: NGF_MODULES
})
export class NgfRootModule {
}

@NgModule({imports: NGF_MODULES, exports: NGF_MODULES})
export class NgfModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgfRootModule}; }
}
