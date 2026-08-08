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
    const {
      flowController$,
      pageController$: parentPageController$,
      state$,
    } = this.getSignals();

    this.setSignals({
      pageController$: this.pageController$,
      flowController$,
      state$,
    });

    this.flowController$ = flowController$;

    // register this component with the flow controller so that it can be managed by the controller
    if (parentPageController$) {
      parentPageController$.registerPage(this);
    } else {
      this.flowController$.registerPage(this);
    }

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

    // watch flowController$ signal for changes to active page and update local properties
    this.watch(this.flowController$, ({ value: flowController }) => {
      // also update reactive state for child components
      this.pageController$.setValue(value => {
        const isActive = flowController.navigation.activePage === this;
        value.isActive = isActive;
        value.isBusy = isActive && flowController.navigation.isPending;
      });
    });

    // wait for child components to complete initialization
    await this.updateComplete;

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

  async onAfterEntering() {
    const onAfterEntering = [];
    this.pageController$.components.forEach(component => {
      if (component.onAfterEntering) {
        onAfterEntering.push(component.onAfterEntering?.());
      }
    });
    await Promise.all(onAfterEntering);
    return onAfterEntering.every(value => value);
  }

  render() {
    return html`<div>
      ${
        this.isActive
          ? html`<h2>${this.heading}</h2>
              <slot name="content"></slot>`
          : ""
      }
      <slot name="pages"></slot>
    </div>`;
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }

      :host([is-active]) {
        display: block;
        padding: 16px;
        border: 3px solid red;
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
