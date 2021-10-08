import { Component, Input, OnInit } from '@angular/core';
import { IWPPost } from '../../models/post.model';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  @Input() post: IWPPost | null = null;

  constructor() { }

  ngOnInit(): void {
    console.log(this.post)
  }

}
