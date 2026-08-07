import { Signal } from "../../../../../signals/index.js";

const state = {
  pages: new Set(),
  navigation: {
    activePage: null,
    isPending: false,
  },
};

export class FlowController extends Signal {
  constructor() {
    super(state);
  }

  get pages() {
    return this.value.pages;
  }

  get activePage() {
    return this.value.navigation.activePage;
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

  get nextPage() {
    // if no active page, start with the first
    if (!this.activePage && this.pages.size > 0) {
      return this.flattenedPages[0];
    }

    // find the current active page
    const activePageIndex = this.flattenedPages.findIndex(
      page => page === this.activePage,
    );

    // if the active page is the last in the sequence, start with the first one
    if (activePageIndex < this.flattenedPages.length - 1) {
      return this.flattenedPages[activePageIndex + 1];
    }
    return this.flattenedPages[0];
  }

  async navigate(targetPage) {
    this.setValue(state => {
      state.navigation.isPending = true;
    });

    const isOnBeforeLeaving = this.activePage
      ? await this.activePage.onBeforeLeaving()
      : true;

    if (!isOnBeforeLeaving) {
      this.setValue(state => {
        state.navigation.isPending = false;
      });
      return;
    }

    const isOnBeforeEntering = await targetPage.onBeforeEntering();

    if (isOnBeforeLeaving && isOnBeforeEntering) {
      this.setActivePage(targetPage);
    }

    // targetPage is now activePage !!!
    this.activePage.onAfterEntering();

    this.setValue(state => {
      state.navigation.isPending = false;
    });
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
    this.setValue(state => {
      state.pages.add(component);
    });
  }
}
