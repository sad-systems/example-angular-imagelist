/**
 * Popup component
 *
 * @author     MrDigger <mrdigger@mail.ru>
 * @copyright  © SAD-Systems [http://sad-systems.ru], 2018
 * @created_on 05.10.2018
 *
 * @module ImageListModule
 *
 * @element PopupComponent
 */

import {AfterViewInit, Component} from '@angular/core';

/**
 * Popup component
 *
 * Represents a popup block with the full image.
 *
 * @class  PopupComponent
 */
@Component({
  selector:    'app-popup',
  templateUrl: './popup.component.pug',
  styleUrls:  ['./popup.component.css']
})
export class PopupComponent implements AfterViewInit {

  // @ViewChild('image') private elImage: ElementRef;

  /**
   * Определяет видимость картинки.
   *
   * @property  isVisible
   * @type      boolean
   * @default   false
   */
  isVisible = false;

  /**
   * Определяет URL картинки.
   *
   * @property  imgSource
   * @type      string
   * @default   ''
   */
  imgSource = '';

  constructor() {}

  ngAfterViewInit() {
    // console.log('AFTER POPUP:', this.elImage);
  }

  /**
   * Отображает элемент, инициализирует загрузку картинки.
   *
   * @public
   * @method show
   *
   * @param {string} url URL картинки
   */
  show(url: string) { // console.log('SHOW', url);
    this.imgSource = url;
    // ...можно добавить анимацию
    this.isVisible = true;
  }

  /**
   * Скрывает элемент
   *
   * @public
   * @method hide
   *
   */
  hide() {
    // ...можно добавить анимацию
    this.isVisible = false;
  }

}
