import { NgModule, ModuleWithProviders } from '@angular/core';
import { Store } from './store.data';

@NgModule({
  declarations: [],
  providers: [
  ]
})
export class SharedDataModule {
  static forRoot(): ModuleWithProviders<SharedDataModule>  {
    return {
      ngModule: SharedDataModule,
      providers: [
        Store,
      ]

    };
  }
}