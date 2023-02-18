import {Service} from './service.js';
import {renderElement, RenderPosition} from './utils.js';
import {BlockPlannerComponent} from "./components/block-planner-component.js";
import {BlockItemsComponent} from "./components/block-items-component.js";
import furniture from "./furniture.js";
import {Dnd} from "./dnd.js";

export class App {
  constructor() {
    this._service = new Service(furniture);
    this._dnd = new Dnd(this._service);
  }

  init(constructorAppElement) {
    const blockPlannerComponent = new BlockPlannerComponent(this._service);
    const blockPlannerElement = blockPlannerComponent.getElement();
    renderElement(constructorAppElement, blockPlannerElement, RenderPosition.BEFOREEND);

    const blockItemsComponent = new BlockItemsComponent(this._service);
    const blockItemsElement = blockItemsComponent.getElement();
    renderElement(constructorAppElement, blockItemsElement, RenderPosition.BEFOREEND);

    this._dnd.init();
  }
}
