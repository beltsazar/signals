import { Signal } from "../../signals/index.js";

const state = {
  children: new Set(),
  activeChild: null,
};

export class PageController extends Signal {
  constructor() {
    super(state);
  }

  get activeChild() {
    return this.value.activeChild;
  }

  get nextChild() {
    const childrenArray = Array.from(this.value.children);

    if (!this.value.activeChild && this.value.children.size > 0) {
      return childrenArray[0];
    }

    const activeChildIndex = childrenArray.findIndex(
      child => child === this.value.activeChild,
    );
    if (activeChildIndex < childrenArray.length - 1) {
      return childrenArray[activeChildIndex + 1];
    }
    return childrenArray[0];
  }

  navigate(targetChild) {
    const isOnBeforeLeaving = this.activeChild
      ? this.activeChild.onBeforeLeaving()
      : true;
    const isOnBeforeEntering = targetChild.onBeforeEntering();

    if (isOnBeforeLeaving && isOnBeforeEntering) {
      this.setActiveChildComponent(targetChild);
    }
  }

  registerChildComponent(component) {
    this.setValue(state => {
      state.children.add(component);
    });
  }

  setActiveChildComponent(component) {
    this.setValue(state => {
      state.activeChild = component;
    });
  }
}
