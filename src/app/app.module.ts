import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SharedDataModule } from './data/shared.store.module';
import { PostcardComponent } from './components/postcard/postcard.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PhotoComponent } from './components/photo/photo.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PostcardComponent,
    GalleryComponent,
    PhotoComponent
  ],
  imports: [
    BrowserModule,
    SharedDataModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
