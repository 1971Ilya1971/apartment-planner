export const HIDE_BLOCK_CLASS = `hidden-block`;
export const SUCCESS_CLASS = `plan__cell_success`;
export const ERROR_CLASS = `plan__cell_error`;
export const CELL_SIZE = 66;

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const AppEvent = {
  ADD: `add`,
  REMOVE: `remove`,
  UPDATE: `update`,
  RESET: `reset`,
  REVERT: `revert`,
};

export const PlanSize = {
  WIDTH: 10,
  HEIGHT: 6,
};

export const Orientation = {
  VERTICAL: `vertical`,
  HORIZONTAL: `horizontal`,
};

export function createElement(template) {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstElementChild;
}

export const renderElement = (container, child, position = RenderPosition.BEFOREEND) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.parentNode.insertBefore(child, container.nextSibling);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.parentNode.insertBefore(child, container);
      break;
  }
};

export function generateId() {
  return Math.random().toString(16).slice(8);
}
