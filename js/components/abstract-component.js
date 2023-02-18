import {createElement} from '../utils.js';

export class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`It's AbstractComponent, we don't need to create them!`);
    }
    this._element = null;
  }

  _getTemplate() {
    throw new Error(`It's AbstractComponent method, please implement it!`);
  }

  getElement() {
    if (!this._element) {
      this._beforeCreateElement();
      this._element = createElement(this._getTemplate());
      this._afterCreateElement();
    }
    return this._element;
  }

  _beforeCreateElement() {
    // abstract hook method
  }

  _afterCreateElement() {
    // abstract hook method
  }
}
