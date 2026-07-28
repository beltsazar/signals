import { Signal } from "../../signals/index.js";

const state = {
  children: new Set(),
  navigation: {
    activeChild: null,
    isPending: false,
  },
};

export class PageController extends Signal {
  constructor() {
    super(state);
  }

  get activeChild() {
    return this.value.navigation.activeChild;
  }

  get nextChild() {
    const childrenArray = Array.from(this.value.children);

    if (!this.activeChild && this.value.children.size > 0) {
      return childrenArray[0];
    }

    const activeChildIndex = childrenArray.findIndex(
      child => child === this.activeChild,
    );
    if (activeChildIndex < childrenArray.length - 1) {
      return childrenArray[activeChildIndex + 1];
    }
    return childrenArray[0];
  }

  async navigate(targetChild) {
    this.setValue(state => {
      state.navigation.isPending = true;
    });

    const isOnBeforeLeaving = (await this.activeChild)
      ? this.activeChild.onBeforeLeaving()
      : true;

    const isOnBeforeEntering = await targetChild.onBeforeEntering();

    if (isOnBeforeLeaving && isOnBeforeEntering) {
      this.setActiveChildComponent(targetChild);
    }

    this.setValue(state => {
      state.navigation.isPending = false;
    });
  }

  registerChildComponent(component) {
    this.setValue(state => {
      state.children.add(component);
    });
  }

  setActiveChildComponent(component) {
    this.setValue(state => {
      state.navigation.activeChild = component;
    });
  }
}
