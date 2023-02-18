import {AppEvent, Orientation, PlanSize} from "./utils.js";

export class Service {
  constructor(items) {
    this._furniture = items;
    this._data = [];
    this._history = [];
  }

  getData() {
    return this._data;
  }

  getFurnitureByGroups() {
    const key = `type`;

    return this._furniture.reduce((item, x) => {
      if (item[x[key]]) {
        item[x[key]].push(x);
      } else {
        item[x[key]] = [x];
      }

      return item;
    }, {});
  }

  getFurnitureById(id) {
    return this._furniture.find((item) => item.id === id);
  }

  validatePosition(cells) {
    return this._isEmptyCells(cells) && this._isCorrectPosition(cells);
  }

  _emitEvent(type, data) {
    window.dispatchEvent(new CustomEvent(type, {detail: data}));
  }

  _isCorrectPosition(cells) {
    return cells.every((cell) => !((cell.x < 1 || cell.x > PlanSize.WIDTH) || (cell.y < 1 || cell.y > PlanSize.HEIGHT)));
  }

  _isEmptyCells(cells) {
    const usedCells = this._getUsedCells();

    return cells.every((cell) => !usedCells[`${cell.x}:${cell.y}`]);
  }

  addItem(id, x, y, orientation) {
    this._saveState();
    this._data.push({id, x, y, orientation});
    this._emitEvent(AppEvent.ADD, {id, x, y});
  }

  removeItem(index) {
    this._saveState();
    this._data.splice(index, 1);
    this._emitEvent(AppEvent.REMOVE, {index});
  }

  updateItem(index, item) {
    this._saveState();
    this._data.splice(index, 1, item);
    this._emitEvent(AppEvent.UPDATE, {index});
  }

  resetItems() {
    this._saveState();
    this._data = [];
    this._emitEvent(AppEvent.RESET);
  }

  revertItems() {
    if (this._history.length > 0) {
      this._data = this._history.pop();
      this._emitEvent(AppEvent.REVERT);
    }
  }

  _getUsedCells() {
    return this._data
      .reduce((acc, {id, x, y, orientation}) => {
        const {size} = this.getFurnitureById(id);

        this
          .getCellsForItem(x, y, size, orientation)
          .forEach((cell) => {
            acc[`${cell.x}:${cell.y}`] = true;
          });

        return acc;
      }, {});
  }

  getCellsForItem(x, y, size, orientation) {
    const cells = [];

    x = +x;
    y = +y;

    switch (orientation) {
      case Orientation.HORIZONTAL:
        for (let i = 0; i < size; i++) {
          cells.push({x: x + i, y});
        }
        break;
      case Orientation.VERTICAL:
        for (let i = 0; i < size; i++) {
          cells.push({x, y: y + i});
        }
        break;
    }

    return cells;
  }

  _saveState() {
    this._history.push(JSON.parse(JSON.stringify(this._data)));
  }
}
