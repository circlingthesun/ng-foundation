import {
  ApplicationRef,
  Injectable,
  Injector,
  ReflectiveInjector,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  TemplateRef,
  ViewRef
} from '@angular/core';

import {ContentRef} from './content-ref';
import {NgfModalBackdrop} from './modal-backdrop';
import {NgfModalWindow} from './modal-window';
import {NgfActiveModal, NgfModalRef} from './modal-ref';

@Injectable()
export class NgfModalStack {
  private _backdropFactory: ComponentFactory<NgfModalBackdrop>;
  private _windowFactory: ComponentFactory<NgfModalWindow>;

  constructor(
      private _applicationRef: ApplicationRef, private _injector: Injector,
      private _componentFactoryResolver: ComponentFactoryResolver) {
    this._backdropFactory = _componentFactoryResolver.resolveComponentFactory(NgfModalBackdrop);
    this._windowFactory = _componentFactoryResolver.resolveComponentFactory(NgfModalWindow);
  }

  open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options): NgfModalRef {
    const containerSelector = options.container || 'body';
    const containerEl = document.querySelector(containerSelector);

    if (!containerEl) {
      throw new Error(`The specified modal container "${containerSelector}" was not found in the DOM.`);
    }

    const activeModal = new NgfActiveModal();
    const contentRef = this._getContentRef(moduleCFR, contentInjector, content, activeModal);

    let windowCmptRef: ComponentRef<NgfModalWindow>;
    let backdropCmptRef: ComponentRef<NgfModalBackdrop>;
    let ngfModalRef: NgfModalRef;


    if (options.backdrop !== false) {
      backdropCmptRef = this._backdropFactory.create(this._injector);
      this._applicationRef.attachView(backdropCmptRef.hostView);
      containerEl.appendChild(backdropCmptRef.location.nativeElement);
    }

    windowCmptRef = this._windowFactory.create(this._injector, contentRef.nodes);
    this._applicationRef.attachView(windowCmptRef.hostView);

    if (options.backdrop !== false) {  
      backdropCmptRef.location.nativeElement.appendChild(windowCmptRef.location.nativeElement);
    } else {
      containerEl.appendChild(windowCmptRef.location.nativeElement);
    }

    ngfModalRef = new NgfModalRef(windowCmptRef, contentRef, backdropCmptRef);

    activeModal.close = (result: any) => { ngfModalRef.close(result); };
    activeModal.dismiss = (reason: any) => { ngfModalRef.dismiss(reason); };

    this._applyWindowOptions(windowCmptRef.instance, options);

    return ngfModalRef;
  }

  private _applyWindowOptions(windowInstance: NgfModalWindow, options: Object): void {
    ['backdrop', 'keyboard', 'size', 'windowClass'].forEach((optionName: string) => {
      if (options[optionName] !== undefined && options[optionName] !== null) {
        windowInstance[optionName] = options[optionName];
      }
    });
  }

  private _getContentRef(
      moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
      context: NgfActiveModal): ContentRef {
    if (!content) {
      return new ContentRef([]);
    } else if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(context);
      this._applicationRef.attachView(viewRef);
      return new ContentRef([viewRef.rootNodes], viewRef);
    } else if (typeof content === 'string') {
      return new ContentRef([[document.createTextNode(`${content}`)]]);
    } else {
      const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
      const modalContentInjector =
          ReflectiveInjector.resolveAndCreate([{provide: NgfActiveModal, useValue: context}], contentInjector);
      const componentRef = contentCmptFactory.create(modalContentInjector);
      this._applicationRef.attachView(componentRef.hostView);
      return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
  }
}