import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

import { PopoverModule } from 'ngx-bootstrap/popover';

import { SwiperModule } from "swiper/angular";
import 'swiper/css/bundle';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { SharedDataModule } from './data/shared.store.module';
import { PostcardComponent } from './components/postcard/postcard.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PhotoComponent } from './components/photo/photo.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PostcardComponent,
    GalleryComponent,
    PhotoComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    SwiperModule,
    HttpClientModule,
    SharedDataModule.forRoot(),
    RouterModule.forRoot([]),
    PopoverModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
