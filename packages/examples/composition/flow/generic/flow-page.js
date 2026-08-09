import { LitElement, css, html } from "lit";
import {
  SignalsProviderMixin,
  SignalsConsumerMixin,
} from "../../../../signals/index.js";
import { PageController } from "./controllers/PageController.js";

export class FlowPage extends SignalsProviderMixin(
  SignalsConsumerMixin(LitElement),
) {
  pageController$ = new PageController(this);

  constructor() {
    super();
    this.isActive = false;
    this.isBusy = false;
    this.hasActiveChildPage = false;
  }

  static get properties() {
    return {
      heading: { type: String },
      isActive: { type: Boolean, attribute: "is-active", reflect: true },
      hasActiveChildPage: {
        type: Boolean,
        attribute: "has-active-child-page",
        reflect: true,
      },
      isBusy: { type: Boolean, attribute: "is-busy", reflect: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();

    /**
     * Get upstream signals: state$, flowController$ and possibly a parent pageController$
     */
    const {
      flowController$,
      pageController$: parentPageController$,
      state$,
    } = this.getSignals();

    /**
     * Set downstream signals: state$, flowController$ and pageController$ of this page
     */
    this.setSignals({
      pageController$: this.pageController$,
      flowController$,
      state$,
    });

    // use the flowController inside this component
    this.flowController$ = flowController$;

    /**
     * Register this page to its parent:
     * 1) flowController$ as the root, or a
     * 2) pageController$ as a parent when inside a nested page
     */
    if (parentPageController$) {
      parentPageController$.registerPage(this);
    } else {
      this.flowController$.registerPage(this);
    }

    // map reactive properties to the local pageController$ state
    this.mapStateToSignals({
      isActive: this.computed(
        this.pageController$,
        ({ value }) => value.isActive,
      ),
      hasActiveChildPage: this.computed(
        this.pageController$,
        ({ value }) => value.hasActiveChildPage,
      ),
      isBusy: this.computed(this.pageController$, ({ value }) => value.isBusy),
    });

    /**
     * Watch the flowController$ for navigation updates
     */
    this.watch(this.flowController$, ({ value: flowController }) => {
      const isActive = flowController.navigation.activePage === this;
      const isBusy = isActive && flowController.navigation.isPending;

      // update the pageController$ reactive state
      this.pageController$.setValue(value => {
        value.isActive = isActive;
        value.isBusy = isBusy;
      });
    });

    // wait for child components to complete initialization!!!
    await this.updateComplete;

    /**
     * Watch reactive state from child pages: if any of the child pages is active oe has an active child,
     * this component will not show its own content, but it will allow nested pages to become visible
     */
    if (this.pageController$.pages.size > 0) {
      const childPageControllers = Array.from(this.pageController$.pages).map(
        page => page.pageController$,
      );

      this.watch([...childPageControllers], childPageController$ => {
        this.pageController$.setValue(value => {
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

  // when page becomes visible in DOM, fire activation hook
  updated(changedProperties) {
    if (changedProperties.has("isActive") && this.isActive) {
      this.onActivation();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async onBeforeLeaving() {
    const onBeforeLeaving = [];
    this.pageController$.components.forEach(component => {
      if (component.onBeforeLeaving) {
        onBeforeLeaving.push(component.onBeforeLeaving?.());
      }
    });
    await Promise.all(onBeforeLeaving);
    return onBeforeLeaving.every(value => value);
  }

  async onBeforeEntering() {
    const onBeforeEntering = [];
    this.pageController$.components.forEach(component => {
      if (component.onBeforeEntering) {
        onBeforeEntering.push(component.onBeforeEntering?.());
      }
    });
    await Promise.all(onBeforeEntering);
    return onBeforeEntering.every(value => value);
  }

  // Page has become visible and ready for user interaction or DOM manipulation
  onActivation() {
    this.pageController$.components.forEach(component => {
      component.onActivation?.();
    });
  }

  /**
   * Only show this page own content when active, but always allow nested pages to become visible
   * @returns {TemplateResult<1>}
   */
  render() {
    return html`
      ${
        this.isActive
          ? html`<h2>${this.heading}</h2>
              <slot></slot>`
          : ""
      }
      <slot name="pages"></slot>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }

      :host([is-active]) {
        display: block;
        padding: 16px;
        border: 1px dashed #000;
      }

      :host([has-active-child-page]) {
        display: block;
      }

      :host([is-busy]) {
        opacity: 0.3;
      }
    `;
  }
}
