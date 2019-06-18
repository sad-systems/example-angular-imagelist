/**
 * Popup service
 *
 * @author     MrDigger <mrdigger@mail.ru>
 * @copyright  © SAD-Systems [http://sad-systems.ru], 2018
 * @created_on 05.10.2018
 *
 * @module ImageListModule
 *
 */

import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { PopupComponent } from './popup.component';

/**
 * Popup service
 *
 * Provides a service to create, show, hide and destroy the Popup component.
 * @see PopupComponent
 *
 * @class  PopupService
 */
@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private popupElement      = null;
  private popupComponentRef = null;
  private popup             = null;

  constructor(private injector:                 Injector,
              private applicationRef:           ApplicationRef,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  /**
   * Отображает Popup компонент
   *
   * @public
   * @method show
   *
   * @param {string} url URL адрес изображения
   */
  show(url) {
    this.getInstance().show(url);
  }

  /**
   * Скрывает Popup компонент
   *
   * @public
   * @method hide
   *
   */
  hide() {
    this.getInstance().hide();
  }

  /**
   * Возвращает экземпляр Popup компонент
   *
   * @public
   * @method getInstance
   *
   */
  getInstance() {
    return this.popup ? this.popup : this.create();
  }

  /**
   * Создаёт Popup компонент
   *
   * @private
   * @method create
   *
   */
  private create() {

    // --- Создаём новый DOM элемен:
    this.popupElement = document.createElement('app-popup');
    // --- Получаем фабрику для создания компонента:
    const factory = this.componentFactoryResolver.resolveComponentFactory(PopupComponent);
    // --- Создаём компонент:
    this.popupComponentRef = factory.create(this.injector, [], this.popupElement);
    // --- Добавляем View компонента в приложение:
    this.applicationRef.attachView(this.popupComponentRef.hostView);
    // --- Сохраняем ссылку на экземпляр компонента:
    this.popup = this.popupComponentRef.instance;

    // --- Добавляем элемент в DOM:
    document.body.appendChild(this.popupElement);

    return this.popup;
  }

  /**
   * Уничтожает Popup компонент
   *
   * @public
   * @method destroy
   *
   */
  destroy() {

    // --- Удаляем Элемент из DOM:
    document.body.removeChild(this.popupElement);
    // --- Удаляем View из приложения:
    this.applicationRef.detachView(this.popupComponentRef.hostView);
    // --- Обнуляем ссылки:
    this.popup             = null;
    this.popupComponentRef = null;
    this.popupElement      = null;

  }

}
