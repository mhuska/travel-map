import { Component, OnInit } from '@angular/core';
import { MapLocation } from '../../data/location.model';
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

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
