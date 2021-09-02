import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapLocation } from '../../models/location.model';
import { Store } from '../../data/store.data';
import { IGalleryItem } from '../../models/gallery-item.model';
import { SwiperComponent } from "swiper/angular";

// install Swiper modules
// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  SwiperOptions
} from "swiper";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  //Swiper Config
  //https://swiperjs.com/angular
  config: SwiperOptions = {
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  //Easy to access selected content
  get content(): MapLocation | null {
    return this.store.CurrentLocation;
  }

  //The items to show in the Swiper
  get items(): IGalleryItem[] {
    let result: IGalleryItem[] = [];
    if (this.content) {
      result.push({id: 0, type: "postcard", item: null});

      result.push(
        ...this.content.Gallery.map((item, index) => {
          return <IGalleryItem>{id: index + 1, type: "media", item: item};
        })
      );
    }

    return result;
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  trackByFn(item: any): number {
    return item.id;
  }

}
