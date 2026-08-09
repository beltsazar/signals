import { Signal } from "../../../../../signals/index.js";

const state = {
  isActive: false,
  isBusy: false,
  hasActiveChildPage: false,
};

export class PageController extends Signal {
  pageComponent;
  pages = new Set();
  components = new Set();

  constructor(pageComponent) {
    super(state);
    this.pageComponent = pageComponent;
  }

  registerPage(component) {
    this.pages.add(component);
  }

  registerComponent(component) {
    this.components.add(component);
  }
}
