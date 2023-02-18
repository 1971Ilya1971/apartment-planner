import {AbstractComponent} from "./abstract-component.js";
import {AppEvent, createElement, Orientation, PlanSize, renderElement} from "../utils.js";

export class PlanComponent extends AbstractComponent {
  constructor(service) {
    super();

    this._service = service;
    this._dataUpdateHandler = this._dataUpdateHandler.bind(this);
    this._addFurnitureToPlan = this._addFurnitureToPlan.bind(this);
    this._buttonRotateClickHandler = this._buttonRotateClickHandler.bind(this);
    this._buttonDeleteClickHandler = this._buttonDeleteClickHandler.bind(this);
  }

  _getTemplate() {
    return `
        <div class="plan">
            <svg width="661" height="397" class="plan__grid-svg">
                <defs>
                    <pattern id="grid" width="66" height="66" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>
            <div class="plan__grid">
                ${this._getPlanCells(PlanSize.WIDTH, PlanSize.HEIGHT)}
            </div>
        </div>
    `;
  }

  _getPlanCells(width, height) {
    let result = ``;

    for (let y = 1; y <= height; y++) {
      for (let x = 1; x <= width; x++) {
        result += `<div class="plan__cell cell-${x}-${y}" data-x="${x}" data-y="${y}"></div>`;
      }
    }

    return result;
  }

  _afterCreateElement() {
    window.addEventListener(AppEvent.ADD, this._dataUpdateHandler);
    window.addEventListener(AppEvent.REMOVE, this._dataUpdateHandler);
    window.addEventListener(AppEvent.UPDATE, this._dataUpdateHandler);
    window.addEventListener(AppEvent.RESET, this._dataUpdateHandler);
    window.addEventListener(AppEvent.REVERT, this._dataUpdateHandler);
  }

  _dataUpdateHandler() {
    this._cleanupPlan();
    this._service.getData().forEach(this._addFurnitureToPlan);
  }

  _addFurnitureToPlan({id, x, y, orientation}, index) {
    const item = this._service.getFurnitureById(id);
    const targetCell = this.getElement().querySelector(`.cell-${x}-${y}`);
    const itemTemplate = this._getItemTemplate(item, targetCell.offsetLeft, targetCell.offsetTop, index);
    const itemElement = createElement(itemTemplate);

    itemElement.style.left = `${targetCell.offsetLeft}px`;
    itemElement.style.top = `${targetCell.offsetTop}px`;

    if (orientation === Orientation.VERTICAL) {
      itemElement.classList.add(`objects__item-rotated`);
    }

    renderElement(this.getElement(), itemElement);

    if (item.size > 1) {
      itemElement.querySelector(`.figure__button-rotate`).addEventListener(`click`, this._buttonRotateClickHandler);
    }
    itemElement.querySelector(`.figure__button-delete`).addEventListener(`click`, this._buttonDeleteClickHandler);
  }

  _getItemTemplate({id, img, name, size, view}, x, y, index) {
    return `
        <div class="objects__item object" data-index="${index}" data-id="${id}">
            <div class="figure ${view}" data-id="${id}">
                <div class="figure__overlay">
                    ${size > 1 ? this._getButtonRotateTemplate() : ``}
                    <svg class="figure__button figure__button-delete" fill="currentColor" height="1em" width="1em">
                        <use xlink:href="#delete-icon"></use>
                    </svg>
                </div>
                <img class="figure__img" src="${img}" alt="${name}">
            </div>
        </div>
    `;
  }

  _buttonRotateClickHandler(evt) {
    const objectItemElement = evt.target.closest(`.objects__item`);
    const {index, id} = objectItemElement.dataset;
    const item = this._service.getData()[index];
    const {size} = this._service.getFurnitureById(id);

    if (size < 2) {
      return;
    }

    const orientation = item.orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
    const cells = this._service.getCellsForItem(item.x, item.y, size, orientation);
    cells.shift();
    const isValid = this._service.validatePosition(cells);

    if (isValid) {
      this._service.updateItem(index, Object.assign({}, item, {orientation}));
    } else {
      const animationEndHandler = () => {
        objectItemElement.classList.remove(`shake-on-hover`);
        objectItemElement.removeEventListener(`animationend`, animationEndHandler);
      };
      objectItemElement.addEventListener(`animationend`, animationEndHandler);
      objectItemElement.classList.add(`shake-on-hover`);
    }
  }

  _buttonDeleteClickHandler(evt) {
    const objectItemElement = evt.target.closest(`.objects__item`);
    const index = objectItemElement.dataset.index;
    this._service.removeItem(index);
  }

  _cleanupPlan() {
    this.getElement().querySelectorAll(`.objects__item`).forEach((item) => item.remove());
  }

  _getButtonRotateTemplate() {
    return `
        <svg class="figure__button figure__button-rotate" fill="currentColor" height="1em" width="1em">
            <use xlink:href="#rotate-icon"></use>
        </svg>
    `;
  }
}
