import { Component, OnInit } from '@angular/core';
import { Store } from '../../data/store.data';

@Component({
  selector: 'app-postcard',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.css']
})
export class PostcardComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

}
