import {AbstractComponent} from "./abstract-component.js";
import {PlanComponent} from "./plan-component.js";
import {renderElement} from "../utils.js";
import {InfoComponent} from "./info-component.js";

export class BlockPlannerComponent extends AbstractComponent {
  constructor(service) {
    super();

    this._service = service;
  }

  _getTemplate() {
    return `
        <section class="scheduler">
            <h1 class="scheduler__title">Планировщик квартиры</h1>
        </section>
    `;
  }

  _afterCreateElement() {
    const planComponent = new PlanComponent(this._service);
    const planElement = planComponent.getElement();
    renderElement(this.getElement(), planElement);

    const infoComponent = new InfoComponent(this._service);
    const infoElement = infoComponent.getElement();
    renderElement(this.getElement(), infoElement);
  }
}
