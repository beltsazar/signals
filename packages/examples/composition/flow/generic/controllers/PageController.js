import { Signal, Watcher } from "../../../../../signals/index.js";

const state = {
  isActive: false,
  isAdvanced: false,
  isCompleted: false,
  isVisitedPage: false,
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

  watchFlowController(flowController$) {
    /**
     * Watch the flowController$ for navigation updates
     */
    new Watcher(flowController$, ({ value: flowController }) => {
      const isActive = flowController.navigation.activePage === this.component;
      const isAdvanced =
        flowController.navigation.advancedPage === this.component;
      const isCompleted =
        flowController.navigation.completedPage === this.component;
      const isVisited =
        flowController.navigation.visitedPage === this.component;
      const isBusy = flowController.navigation.isPending;

      // update the pageController$ reactive state
      this.setValue(value => {
        value.isActive = isActive;
        value.isBusy = isBusy;
        value.isCompleted = isCompleted;
        value.isAdvanced = isAdvanced;
        value.isVisited = isVisited;
      });
    });
  }

  /**
   * Watch reactive state from child pages: if any of the child pages is active or has an active child,
   * this component will not show its own content, but it will allow nested pages to become visible
   */
  watchChildPageControllers() {
    if (this.pages.size > 0) {
      const childPageControllers = Array.from(this.pages).map(
        page => page.pageController$,
      );

      new Watcher([...childPageControllers], childPageController$ => {
        this.setValue(value => {
          value.hasActiveChildPage = childPageController$
            .map(
              controller =>
                controller.value.isActive ||
                controller.value.hasActiveChildPage,
            )
            .some(value => value);
        });
      });
    }
  }
}
