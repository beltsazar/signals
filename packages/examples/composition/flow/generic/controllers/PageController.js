import { Signal } from "../../../../../signals/index.js";

const state = {
  isActive: false,
  isBusy: false,
  hasActiveChildPage: false,
};

export class PageController extends Signal {
  component;
  pages = new Set();
  components = new Set();

  constructor(component) {
    super(state);
    this.component = component;
  }

  registerPage(component) {
    this.pages.add(component);
  }

  registerComponent(component) {
    this.components.add(component);
  }
}
