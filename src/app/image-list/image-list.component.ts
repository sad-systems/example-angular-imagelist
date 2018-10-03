import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ajax } from 'rxjs/ajax';

import { PopupService } from '../popup/popup.service';

import { Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Equal } from 'lodash';

@Component({
  selector:    'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, AfterViewChecked {

  textTitle     = 'Коллекция картинок';
  textButton    = 'Загрузить еще';
  textPreloader = 'Загружается...';
  textAlbum     = 'Альбом';
  textPhoto     = 'Фото';
  apiUrl        = 'https://jsonplaceholder.typicode.com/photos?_start=[start]&_limit=[limit]';
  imageList     = [];
  isEndOfList   = true;
  listLimit     = 9;
  listPosition  = 0;
  inProgress    = false;

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
   */
  constructor(private popup: PopupService, private renderer: Renderer2) {}

  /**
   * При создании компонента
   */
  ngOnInit () {

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
  ngAfterViewChecked() {
    // --- Уведомляем об изменении состояния контейнера списка:
    this.containerState.next( this.conteinerElement.nativeElement );
  }

  /**
   * Инициирует получение новой порции списка
   */
  getNextList() {

    const url = this.apiUrl
      .replace('[start]', this.listPosition.toString())
      .replace('[limit]', (this.listLimit + 1).toString()); // <--- (+1) чтобы убедиться, что после listLimit точно ещё что-то есть

    this.inProgress = true;
    ajax.getJSON(url).subscribe( this.parseResponse.bind(this), this.parseError.bind(this) ); // console.log('getNext:', url);

  }

  /**
   * Обрабатывает полученные от сервера данные
   *
   * @param {Array} response Массив с картинками
   */
  parseResponse( response ) {

    if ( !(response instanceof Array) ) { this.parseError({ 'error': 'Сервер вернул не корректные данные' } ); }

    for (let i = 0; i < this.listLimit; i++) {
      this.imageList.push(response[i]);
    }

    this.listPosition += this.listLimit;
    this.isEndOfList   = response.length < (this.listLimit + 1) ? true : false;
    this.inProgress    = false;

  }

  /**
   * Обрабатывает ошибку
   *
   * @param {Object} error
   */
  parseError( error ) {
    console.log( 'ERROR:', error );
    this.inProgress = false;
  }

  /**
   * Вызывает popup
   *
   * @param {string} url
   */
  pupupImage( url ) {
    this.popup.show(url);
    return false;
  }

  /**
   * Скролит вниз страницы
   */
  private scrollDown() {                                               // console.log('SCROLL:', this.conteinerElement.nativeElement);

    if (!this.conteinerElement) { return; }
    const el = this.conteinerElement.nativeElement;                    // console.log('BEF:', el.scrollTop, el.scrollHeight);
    this.renderer.setProperty(el, 'scrollTop', el.scrollHeight); // console.log('FIN:', el.scrollTop);

  }

  /**
   * Уведомляет о загрузке картинки
   *
   * @info Картинки загружаются асинхронно и меняют размеры страницы.
   *       В частности они меняют размер scrollHeight.
   *       И происходить это может уже после того как ngAfterViewChecked сообщил о завершении рендеринга.
   *       В следствии чего функция scrollDown не будет отрабатывать правильно.
   *
   *       PS: данный метод не нужет, если мы заранее знаем размеры загружаемых картинок.
   */
  imageIsLoaded() {
    // --- Уведомляем об изменении состояния контейнера списка:
    this.containerState.next( this.conteinerElement.nativeElement ); // console.log('LOADED');
  }

}
