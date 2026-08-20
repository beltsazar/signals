import { Signal } from "../../../../../signals/index.js";

const state = {
  isActive: false,
  isAdvanced: false,
  isCompleted: false,
  isVisited: false,
  isBusy: false,
  hasActiveChildPage: false,
};

export class PageController extends Signal {
  element; // the page web element
  pages = new Set();
  components = new Set();

  constructor(element) {
    super(state);
    this.element = element;
  }

  registerPage(element) {
    this.pages.add(element);
  }

  registerComponent(element) {
    this.components.add(element);
  }

  watchFlowController(flowController$) {
    /**
     * Watch the flowController$ for navigation updates
     */
    this.element.watch(flowController$, ({ value: flowController }) => {
      const isActive = flowController.navigation.activePage === this.element;
      const isAdvanced =
        flowController.navigation.advancedPage === this.element;

      const componentIndex = flowController$.getFlattenedPageIndex(
        this.element,
      );
      const advancedPageIndex = flowController$.getFlattenedPageIndex(
        flowController.navigation.advancedPage,
      );

      // Everything BEFORE the advancedPage is considered completed
      const isCompleted =
        flowController.navigation.completedPage === this.element ||
        advancedPageIndex > componentIndex;

      // Everything BEFORE and INCLUDING the advancedPage is considered visited
      const isVisited =
        flowController.navigation.visitedPage === this.element ||
        advancedPageIndex > componentIndex;

      const blockedPageIndex = flowController$.getFlattenedPageIndex(
        flowController.navigation.blockedPage,
      );

      const isBlocked =
        flowController.navigation.blockedPage === this.element ||
        blockedPageIndex > componentIndex;

      const isBusy = flowController.navigation.isPending;

      // update the pageController$ reactive state
      this.setValue(value => {
        value.isActive = isActive;
        value.isAdvanced = isAdvanced;
        value.isCompleted = isCompleted;
        value.isVisited = isVisited;
        value.isBlocked = isBlocked;
        value.isBusy = isBusy;
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

      this.element.watch([...childPageControllers], childPageController$ => {
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
