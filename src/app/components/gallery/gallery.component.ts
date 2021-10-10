import { Component, OnInit } from '@angular/core';
import { MapLocation } from '../../models/location.model';
import { Store } from '../../data/store.data';
import { IGalleryItem } from '../../models/gallery-item.model';
import { IWPPost } from '../../models/post.model';

// install Swiper modules
// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  EffectCards,
  EffectCoverflow
} from "swiper";

// install Swiper components
SwiperCore.use([
  Navigation,
  Pagination,
  EffectCards,
  EffectCoverflow
]);

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  //Easy to access selected content
  get content(): MapLocation | null {
    return this.store.CurrentLocation;
  }

  get screenWidth(): number {
    return window.innerWidth ? window.innerWidth : 100;   
  }

  //The items to show in the Swiper
  get items(): IGalleryItem[] {
    let result: IGalleryItem[] = [];
    if (this.content) {
      result.push({id: 0, type: "postcard", item: <IWPPost>{url: this.content.Image}});

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

  hide() {
    this.store.SetLocation(null);
  }

}
