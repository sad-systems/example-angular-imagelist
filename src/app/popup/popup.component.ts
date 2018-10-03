import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector:    'app-popup',
  templateUrl: './popup.component.html',
  styleUrls:  ['./popup.component.css']
})
export class PopupComponent implements AfterViewInit {

  // @ViewChild('image') private elImage: ElementRef;

  isVisible = false;
  imgSource = '';

  constructor() {}

  ngAfterViewInit() {
    // console.log('AFTER POPUP:', this.elImage);
  }

  show(url: string) { // console.log('SHOW', url);
    this.imgSource = url;
    // ...можно добавить анимацию
    this.isVisible = true;
  }

  hide() {
    // ...можно добавить анимацию
    this.isVisible = false;
  }

}
