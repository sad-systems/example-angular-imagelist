/**
 * Image list component
 *
 * @author     MrDigger <mrdigger@mail.ru>
 * @copyright  © SAD-Systems [http://sad-systems.ru], 2018
 * @created_on 05.10.2018
 *
 * @module ImageListModule
 * @main   ImageListModule
 *
 * @element ImageList
 */

import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

import { PopupService } from '../popup/popup.service';
import { ImageListService } from './image-list.service';

import { Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Equal } from 'lodash';


/**
 * Image list component
 *
 * Represents a list of images of 9 pieces per page.
 *
 * @class  ImageListComponent
 */
@Component({
  selector:    'app-image-list',
  templateUrl: './image-list.component.pug',
  styleUrls:  ['./image-list.component.css'],
  providers:  [ ImageListService ],
})
export class ImageListComponent implements OnInit, AfterViewChecked {

  /**
   * Текст кнопки "Загрузить ещё"
   *
   * @property textButton
   * @type     string
   */
  textButton = 'Загрузить еще';

  /**
   * Текст прелоадера.
   *
   * @property textButton
   * @type     string
   */
  textPreloader = 'Загружается...';

  /**
   * Текст надписи "Альбом"
   *
   * @property textButton
   * @type     string
   */
  textAlbum  = 'Альбом';

  /**
   * Текст надписи "Фото"
   *
   * @property textPhoto
   * @type     string
   */
  textPhoto = 'Фото';

  /**
   * Количество картинок на странице
   *
   * @property listLimit
   * @type     int
   * @default  9
   */
  listLimit = 9;

  /**
   * Текущаяя позиция последнего элемента в списке
   *
   * @property listPosition
   * @type     int
   * @default  0
   */
  listPosition = 0;

  /**
   * @private
   * @property imageList
   * @type     string
   */
  protected imageList = [];

  /**
   * @private
   * @property isEndOfList
   * @type     string
   */
  private isEndOfList = true;

  /**
   * @private
   * @property inProgress
   * @type     boolean
   * @default  false
   */
  protected inProgress = false;

  /**
   * Доступ к контейнеру списка
   */
  @ViewChild('conteiner') private conteinerElement: ElementRef;

  /**
   * Состояние контейнера списка:
   */
  private containerState = new Subject();

  /**
   * Конструктор - подключаем зависимости
   *
   * @param popup
   * @param renderer
   * @param dataService
   */
  constructor(private popup: PopupService, private renderer: Renderer2, private dataService: ImageListService) {}

  /**
   * При создании компонента
   */
  ngOnInit ()
  {
    // --- Подписываемся на прослушку изменения скролинга у контейнера списка:
    this.containerState.pipe(
      map( (el: HTMLElement) => el.scrollHeight ),
      distinctUntilChanged( Equal )
    )
      .subscribe( (value) => this.scrollDown() );

    // --- Запрашиваем первый список:
    this.getNextList();
  }

  /**
   * После рендеринга всех компонентов
   */
  ngAfterViewChecked()
  {
    // --- Уведомляем об изменении состояния контейнера списка:
    this.containerState.next( this.conteinerElement.nativeElement );
  }

  /**
   * Инициирует получение новой порции списка
   *
   * @public
   * @method getNextList
   *
   */
  getNextList()
  {
    this.inProgress = true;
    this.dataService.getNextData(this.listPosition, this.listLimit)
      .subscribe(this.parseResponse.bind(this), this.parseError.bind(this));
  }

  /**
   * Обрабатывает полученные от сервера данные
   *
   * @protected
   * @method parseResponse
   *
   * @param {Array} response Массив с картинками
   */
  protected parseResponse( response )
  {
    if ( !(response instanceof Array) ) {
      this.parseError({ 'error': 'Сервер вернул не корректные данные' } );
      return;
    }

    this.imageList.push.apply(this.imageList, response);

    this.listPosition += this.listLimit;
    this.isEndOfList   = this.dataService.isDataFinished();
    this.inProgress    = false;
  }

  /**
   * Обрабатывает ошибку
   *
   * @protected
   * @method parseError
   *
   * @param {Object} error Объект с параметрами ошибки
   */
  protected parseError( error )
  {
    console.log( 'ERROR:', error );
    this.inProgress = false;
  }

  /**
   * Вызывает popup
   *
   * @protected
   * @method popupImage
   *
   * @param {string} url URL картинки
   */
  protected popupImage(url)
  {
    this.popup.show(url);
    return false;
  }

  /**
   * Скролит вниз страницы
   *
   * @private
   * @method scrollDown
   *
   */
  private scrollDown()
  {                                                                    // console.log('SCROLL:', this.conteinerElement.nativeElement);
    if (!this.conteinerElement) { return; }
    const el = this.conteinerElement.nativeElement;                    // console.log('BEF:', el.scrollTop, el.scrollHeight);
    this.renderer.setProperty(el, 'scrollTop', el.scrollHeight); // console.log('FIN:', el.scrollTop);
  }

  /**
   * Уведомляет о загрузке картинки
   *
   * @private
   * @method imageIsLoaded
   *
   * @info Картинки загружаются асинхронно и меняют размеры страницы.
   *       В частности они меняют размер scrollHeight.
   *       И происходить это может уже после того как ngAfterViewChecked сообщил о завершении рендеринга.
   *       В следствии чего функция scrollDown не будет отрабатывать правильно.
   *
   *       PS: данный метод не нужет, если мы заранее знаем размеры загружаемых картинок.
   */
  private imageIsLoaded()
  {
    // --- Уведомляем об изменении состояния контейнера списка:
    this.containerState.next( this.conteinerElement.nativeElement ); // console.log('LOADED');
  }

}
