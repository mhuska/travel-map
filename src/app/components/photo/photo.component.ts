import { Component, Input } from '@angular/core';
import { IWPPost } from '../../models/post.model';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent {

  @Input() post: IWPPost | null = null;

  constructor() { }

}
