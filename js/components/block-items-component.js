import {AbstractComponent} from "./abstract-component.js";

export class BlockItemsComponent extends AbstractComponent {
  constructor(service) {
    super();

    this._service = service;
    this._furniture = this._service.getFurnitureByGroups();

    this._getFurnitureSectionTemplate = this._getFurnitureSectionTemplate.bind(this);
    this._getItemsTemplate = this._getItemsTemplate.bind(this);
  }

  _getTemplate() {
    return `
        <section class="constructor__aside">
            <div class="objects">
                <h2 class="objects__title">Выберите предметы мебели</h2>
                <div class="objects__sections">
                    ${Object.keys(this._furniture).map(this._getFurnitureSectionTemplate).join(``)}
                </div>
            </div>
        </section>
    `;
  }

  _getFurnitureSectionTemplate(type) {
    const items = this._furniture[type];

    return `
        <section class="objects__section">
            <h3 class="objects__subtitle">${type}</h3>
            <div class="objects__list">
                ${items.map(this._getItemsTemplate).join(``)}
            </div>
        </section>
    `;
  }

  _getItemsTemplate({id, img, name, view}) {
    return `
        <div class="objects__item object">
            <div class="figure ${view}" draggable="true" data-id="${id}">
                <div class="figure__overlay"></div>
                <img class="figure__img" src="${img}" alt="${name}">
            </div>
            <div class="object__name">${name}</div>
        </div>
    `;
  }
}
