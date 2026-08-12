import { Signal } from "../../../../../signals/index.js";

const state = {
  navigation: {
    activePage: null,
    progressPage: null,
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

  get progressPage() {
    return this.value.navigation.progressPage;
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

    // find the current active page
    const activePageIndex = this.navigationPages.findIndex(
      page => page === this.activePage,
    );

    // if the active page is the last in the sequence, start with the first one
    if (activePageIndex < this.navigationPages.length - 1) {
      return this.navigationPages[activePageIndex + 1];
    }
    return null;
  }

  get previousPage() {
    // if no active page, start with the first
    if (!this.activePage && this.pages.size > 0) {
      return null;
    }

    // find the current active page
    const activePageIndex = this.navigationPages.findIndex(
      page => page === this.activePage,
    );

    // if the active page is the first in the sequence, return null
    if (activePageIndex > 0) {
      return this.navigationPages[activePageIndex - 1];
    }
    return null;
  }

  async navigate(targetPage) {
    // if the target page is null or is already active, do nothing
    if (!targetPage) {
      return false;
    }

    this.setValue(state => {
      state.navigation.isPending = true;
    });

    /**
     * When navigating to the same page (activePage === targetPage), only execute onBeforeEntering hook.
     */

    // Execute onBeforeLeaving hook on the active page if available
    const isOnBeforeLeaving = this.activePage
      ? await this.activePage.onBeforeLeaving()
      : true;

    // if onBeforeLeaving hook fails, do nothing
    if (!isOnBeforeLeaving) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return false;
    }

    /**
     * When navigating to the same page (activePage === targetPage), don't actually navigate, but return true
     */
    if (this.activePage === targetPage) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return true;
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
    this.setActivePage(targetPage);

    // navigation is complete
    this.setValue(state => {
      state.navigation.isPending = false;
    });

    return true;
  }

  // progress to the next page if navigation successful and set the page status
  async progress() {
    const activePage = this.activePage;
    const isNavigated = await this.navigate(this.nextPage);
    if (isNavigated) {
      this.setValue(value => {
        value.navigation.progressPage = activePage;
      });
    }
  }

  getPageById(id) {
    return this.flattenedPages.find(page => page.id === id);
  }

  get activePageIndex() {
    return this.navigationPages.findIndex(page => page === this.activePage);
  }

  get progressPageIndex() {
    return this.navigationPages.findIndex(page => page === this.progressPage);
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
