/**
 * Image list service
 *
 * @author     MrDigger <mrdigger@mail.ru>
 * @copyright  © SAD-Systems [http://sad-systems.ru], 2018
 * @created_on 05.10.2018
 *
 * @module ImageListModule
 *
 */
import { Injectable } from '@angular/core';

import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

/**
 * Image list service
 *
 * Provides a service to obtain the data for ImageListComponent.
 * @see ImageListComponent
 *
 * @class  ImageListService
 */
@Injectable()
export class ImageListService {

  /**
   * URL шаблон обращения к серверному хранилищу картинок.
   * Внутри шаблона можно использовать маркеры [start] и [limit],
   * которые будут заменены на соответствующие значения.
   *
   * @property apiUrl
   * @type     string
   */
  apiUrl = 'https://jsonplaceholder.typicode.com/photos?_start=[start]&_limit=[limit]';

  /**
   * Признак того, что на сервере больше нет данных
   */
  private isDataFinishedFlag = false;

  /**
   * Конструктор
   */
  constructor() {}

  /**
   * Инициирует получение новой порции данных
   *
   * @public
   * @method getNextList
   *
   * @param {number} offset Смещение от начала
   * @param {number} limit  Максимальное количество получаемых данных
   *
   * @return {Observable}
   */
  getNextData(offset: number, limit: number)
  {
    const url = this.apiUrl
      .replace('[start]', offset.toString())
      .replace('[limit]', (limit + 1).toString()); // <--- (+1) чтобы убедиться, что после limit точно ещё что-то есть

    this.isDataFinishedFlag = false;

    return ajax.getJSON(url)
      .pipe( map(
        response => {
          if (response instanceof Array) {
            if (response.length > limit) {
              response.pop();             //<--- удаляем лишний (+1 добавленный элемент)
            } else {
              this.isDataFinishedFlag = true; //<--- Даннх больше нет
            }
          }
        return response;
      }
    ) ); //.subscribe( done , error );
  }

  /**
   * Возвращает TRUE если на сервере больше нет данных.
   *
   * @public
   * @method isDataFinished
   *
   */
  isDataFinished(): boolean
  {
    return this.isDataFinishedFlag;
  }

}
