import { Component, OnInit } from '@angular/core';
import { MapLocation } from '../../models/location.model';
import { Store } from '../../data/store.data';

@Component({
  selector: 'app-postcard',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.css']
})
export class PostcardComponent implements OnInit {

  get content(): MapLocation | null {
    return this.store.CurrentLocation;
  }

  get includeExcerpt(): boolean {
    return this.content.Content && this.content.Content.length > 75 ? false : true;
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  ZoomTo() {
    console.log("zoomto")
    this.content.ZoomTo();
  }

}
