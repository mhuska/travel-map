import { Component, OnInit } from '@angular/core';
import { MapLocation } from '../../models/location.model';
import { Store } from '../../data/store.data';
import { IGalleryItem } from '../../models/gallery-item.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  get content(): MapLocation | null {
    return this.store.CurrentLocation;
  }

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
