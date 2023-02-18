import {AbstractComponent} from "./abstract-component.js";
import {PlanSize} from "../utils.js";

export class InfoComponent extends AbstractComponent {
  constructor(service) {
    super();

    this._service = service;

    this._clickUndoHandler = this._clickUndoHandler.bind(this);
    this._clickResetHandler = this._clickResetHandler.bind(this);
  }

  _getTemplate() {
    return `
      <div class="scheduler__footer">
        <ul class="scheduler__data">
          <li class="scheduler__data-item">Площадь квадрата 1 кв. м.</li>
          <li class="scheduler__data-item">Площадь квартиры ${PlanSize.HEIGHT * PlanSize.WIDTH} кв. м.</li>
        </ul>
        <div class="scheduler__actions">
          <button class="scheduler__action undo scheduler__action-undo" type="button">
            <svg class="undo__icon" fill="currentColor" height="1em" width="1em">
              <use xlink:href="#undo-icon"></use>
            </svg>
            Отменить последний шаг
          </button>
          <button class="scheduler__action button scheduler__action-reset" type="button">
            <svg class="button__icon" fill="currentColor" height="1em" width="1em">
              <use xlink:href="#delete-icon"></use>
            </svg>
            Очистить квартиру
          </button>
        </div>
      </div>
    `;
  }

  _afterCreateElement() {
    this.getElement().querySelector(`.scheduler__action-undo`).addEventListener(`click`, this._clickUndoHandler);
    this.getElement().querySelector(`.scheduler__action-reset`).addEventListener(`click`, this._clickResetHandler);
  }

  _clickUndoHandler() {
    this._service.revertItems();
  }

  _clickResetHandler() {
    this._service.resetItems();
  }
}

