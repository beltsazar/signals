import { Signal } from "../../../../../signals/index.js";

const state = {
  pages: new Set(),
  components: new Set(),
  isActive: false,
  isBusy: false,
  hasActiveChildPage: false,
};

export class PageController extends Signal {
  constructor() {
    super(state);
  }

  get pages() {
    return this.value.pages;
  }

  get components() {
    return this.value.components;
  }

  registerPage(component) {
    this.setValue(state => {
      state.pages.add(component);
    });
  }

  registerComponent(component) {
    this.setValue(state => {
      state.components.add(component);
    });
  }
}
