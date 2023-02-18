import {CELL_SIZE, ERROR_CLASS, Orientation, SUCCESS_CLASS} from "./utils.js";

export class Dnd {
  constructor(service) {
    this._service = service;

    this._draggableItem = null;

    this._dragoverHandler = this._dragoverHandler.bind(this);
    this._dropHandler = this._dropHandler.bind(this);
    this._dragstartHandler = this._dragstartHandler.bind(this);
    this._dragendHandler = this._dragendHandler.bind(this);
  }

  init() {
    this._planGridElement = document.querySelector(`.plan__grid`);
    this._planCellElements = this._planGridElement.querySelectorAll(`.plan__cell`);

    document.addEventListener(`dragstart`, this._dragstartHandler, true);
    document.addEventListener(`dragover`, this._dragoverHandler, true);
    document.addEventListener(`drop`, this._dropHandler);
    document.addEventListener(`dragend`, this._dragendHandler);
  }

  _dragstartHandler(evt) {
    this._draggableItem = this._service.getFurnitureById(evt.target.dataset.id);
    this._draggableItemPosition = Math.trunc(evt.offsetX / CELL_SIZE);

    this._planCellElements.forEach((element) => element.classList.add(`plan__cell_hack`));
  }

  _dragoverHandler(evt) {
    this._markCellsReset();

    if (!evt.target.classList.contains(`plan__cell`)) {
      return;
    }

    const x = +evt.target.dataset.x - this._draggableItemPosition;
    const y = +evt.target.dataset.y;
    const cells = this._service.getCellsForItem(x, y, this._draggableItem.size, Orientation.HORIZONTAL);

    const isValid = this._service.validatePosition(cells);
    this._markCells(cells, isValid ? SUCCESS_CLASS : ERROR_CLASS);

    if (isValid) {
      evt.preventDefault();
    }
  }

  _dropHandler(evt) {
    const x = +evt.target.dataset.x - this._draggableItemPosition;
    const y = +evt.target.dataset.y;
    this._service.addItem(this._draggableItem.id, x, y, Orientation.HORIZONTAL);
  }

  _dragendHandler() {
    this._draggableItem = null;
    this._markCellsReset();
    this._planCellElements.forEach((element) => element.classList.remove(`plan__cell_hack`));
  }

  _markCells(cells, state) {
    cells.forEach(({x, y}) => {
      const cellElement = this._planGridElement.querySelector(`.cell-${x}-${y}`);

      if (cellElement) {
        cellElement.classList.add(state);
      }
    });
  }

  _markCellsReset() {
    this._planGridElement
      .querySelectorAll(`.${SUCCESS_CLASS}`)
      .forEach((element) => element.classList.remove(SUCCESS_CLASS));
    this._planGridElement
      .querySelectorAll(`.${ERROR_CLASS}`)
      .forEach((element) => element.classList.remove(ERROR_CLASS));
  }
}
