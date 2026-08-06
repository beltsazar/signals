import { Signal } from "../../../signals/index.js";

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

  get sequentialPages() {
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
    if (!this.activePage && this.value.pages.size > 0) {
      return this.sequentialPages[0];
    }

    const activePageIndex = this.sequentialPages.findIndex(
      page => page === this.activePage,
    );
    if (activePageIndex < this.sequentialPages.length - 1) {
      return this.sequentialPages[activePageIndex + 1];
    }
    return this.sequentialPages[0];
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

    this.setValue(state => {
      state.navigation.isPending = false;
    });
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
