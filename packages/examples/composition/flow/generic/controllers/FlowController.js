import { Signal } from "../../../../../signals/index.js";

const state = {
  navigation: {
    activePage: null,
    advancedPage: null,
    completedPage: null,
    visitedPage: null,
    isPending: false,
  },
};

export class FlowController extends Signal {
  pages = new Set();

  constructor() {
    super(state);
  }

  get activePage() {
    return this.value.navigation.activePage;
  }

  get activePageIndex() {
    return this.getNavigationPageIndex(this.activePage);
  }

  get flattenedPages() {
    function getPages(pages, accumulator = []) {
      pages.forEach(page => {
        accumulator.push(page);
        if (page.pageController$.pages.size > 0) {
          getPages(page.pageController$.pages, accumulator);
        }
      });
      return accumulator;
    }
    return getPages(this.pages);
  }

  get navigationPages() {
    function getPages(pages, accumulator = []) {
      pages.forEach(page => {
        // skip pages that have no valid condition
        if (!page.isConditionValid()) {
          return;
        }
        accumulator.push(page);
        if (page.pageController$.pages.size > 0) {
          getPages(page.pageController$.pages, accumulator);
        }
      });
      return accumulator;
    }
    return getPages(this.pages);
  }

  get nextPage() {
    // if no active page, start with the first
    if (!this.activePage && this.pages.size > 0) {
      return this.navigationPages[0];
    }

    // if the active page is the last in the sequence, start with the first one
    if (this.activePageIndex < this.navigationPages.length - 1) {
      return this.navigationPages[this.activePageIndex + 1];
    }
    return null;
  }

  get previousPage() {
    // if no active page, start with the first
    if (!this.activePage && this.pages.size > 0) {
      return null;
    }

    // if the active page is the first in the sequence, return null
    if (this.activePageIndex > 0) {
      return this.navigationPages[this.activePageIndex - 1];
    }
    return null;
  }

  /**
   * Commit consumer changes on the active page and advance to the next page in the process, allowing hooks, validation, and consumer logic to be executed.
   * @param targetPage
   * @returns {Promise<boolean>}
   */
  async commitPage(targetPage) {
    const activePage = this.activePage;

    // if no target page is provided, advance to the next page
    if (!targetPage) {
      targetPage = this.nextPage;
    }

    // if the target page is null or is already active, do nothing
    if (!targetPage) {
      return false;
    }

    this.setValue(state => {
      state.navigation.isPending = true;
    });

    // Execute onBeforeLeaving hook on the active page if available
    const isOnBeforeLeaving = activePage
      ? await activePage.onBeforeLeaving()
      : true;

    // if onBeforeLeaving hook fails, do nothing
    if (!isOnBeforeLeaving) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return false;
    }

    // Execute isOnBeforeEntering hook on the target page
    const isOnBeforeEntering = await targetPage.onBeforeEntering();

    // if onBeforeLeaving hook fails, do nothing
    if (!isOnBeforeEntering) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return false;
    }

    // if all conditions are met, navigate to the target page
    // this.setActivePage(targetPage);

    // navigation is complete
    this.setValue(state => {
      state.navigation.completedPage = activePage; // the active page has been completed!
      state.navigation.activePage = targetPage; // the target page is now active
      state.navigation.advancedPage = targetPage; // the progress is advanced to the target page
      state.navigation.visitedPage = targetPage; // the target page is now visited;
      state.navigation.isPending = false;
    });

    return true;
  }

  // simple page navigation
  navigatePage(target) {
    this.setActivePage(target);
  }

  getNavigationPageIndex(pageComponent) {
    return this.navigationPages.findIndex(page => page === pageComponent);
  }

  getPageById(id) {
    return this.flattenedPages.find(page => page.id === id);
  }

  setActivePage(component) {
    this.setValue(state => {
      state.navigation.activePage = component;
    });
  }

  registerPage(component) {
    this.pages.add(component);
  }
}
