import { Signal } from "../../../../../signals/index.js";

const state = {
  navigation: {
    activePage: null,
    advancedPage: null,
    completedPage: null,
    visitedPage: null,
    blockedPage: null,
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

        const isGroup = page.pageController$.pages.size > 0;

        if (isGroup && page.hasContent) {
          // group pages with content are included in the navigation
          accumulator.push(page);
          // add nested pages to the accumulator
          getPages(page.pageController$.pages, accumulator);
        } else if (isGroup) {
          // add nested pages to the accumulator
          getPages(page.pageController$.pages, accumulator);
        } else {
          accumulator.push(page);
        }
      });
      return accumulator;
    }
    return getPages(this.pages);
  }

  get nestedNavigationPages() {
    function getNestedPages(pages, accumulator = []) {
      pages.forEach(page => {
        // skip pages that have no valid condition
        if (!page.isConditionValid()) {
          return;
        }

        if (page.pageController$.pages.size > 0) {
          const children = [];
          getNestedPages(page.pageController$.pages, children);
          accumulator.push(page, children);
        } else {
          accumulator.push(page);
        }
      });
      return accumulator;
    }
    return getNestedPages(this.pages);
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

    const previousPage =
      this.activePageIndex > 0
        ? this.navigationPages[this.activePageIndex - 1]
        : null;

    if (previousPage && !previousPage.pageController$.value.isBlocked) {
      return previousPage;
    }
    return null;
  }

  /**
   * Commit consumer changes on the active page and advance to the next page in the process, allowing hooks, validation, and consumer logic to be executed.
   * @returns {Promise<boolean>}
   */
  async advancePage(targetPage) {
    const activePage = this.activePage; // might be null if this is the first page in the flow

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

    // Execute onAfterLeaving hook on the active page to execute display logic
    activePage?.onAfterLeaving();

    // if the target page is not provided, use the next page in the sequence
    targetPage = targetPage ?? this.nextPage;

    // if there is no next page, the navigation is complete
    if (!targetPage) {
      // navigation is complete
      this.setValue(state => {
        state.navigation.completedPage = activePage; // the active page has been completed!
        state.navigation.isPending = false;
      });

      return true;
    }

    /**
     * If there is a next target page, continue with the navigation process:
     */

    // Execute isOnBeforeEntering hook on the target page
    const isOnBeforeEntering = await targetPage.onBeforeEntering();

    // if onBeforeLeaving hook fails, do nothing
    if (!isOnBeforeEntering) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return false;
    }

    // navigation is complete
    this.setValue(state => {
      state.navigation.completedPage = activePage; // the active page has been completed!
      state.navigation.activePage = targetPage; // the target page is now active
      state.navigation.advancedPage = targetPage; // the progress is advanced to the target page
      state.navigation.visitedPage = targetPage; // the target page is now visited;
      state.navigation.isPending = false;
    });

    // allow the target page to become active, update its state and become visible
    await targetPage.updateComplete;

    // Execute onAfterEntering hook on the target page to execute display logic
    targetPage.onAfterEntering();

    return true;
  }

  // simple page navigation
  navigatePage(target) {
    this.setActivePage(target);
  }

  getNavigationPageIndex(pageComponent) {
    return this.navigationPages.findIndex(page => page === pageComponent);
  }

  getFlattenedPageIndex(pageComponent) {
    return this.flattenedPages.findIndex(page => page === pageComponent);
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

  /**
   * The page component and its predecessors are considered blocked, and the user cannot navigate to them anymore.
   * @param {HTMLElement} component
   */
  setBlockedPage(component) {
    this.setValue(state => {
      state.navigation.blockedPage = component;
    });
  }
}
