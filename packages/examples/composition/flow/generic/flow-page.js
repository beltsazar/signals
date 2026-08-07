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
  }

  static get properties() {
    return {
      heading: { type: String },
      isActive: { type: Boolean, attribute: "is-active", reflect: true },
      isBusy: { type: Boolean, attribute: "is-busy", reflect: true },
    };
  }

  connectedCallback() {
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

    // watch flowController$ signal for changes to active page and update local properties
    this.watch(this.flowController$, ({ value: flowController }) => {
      this.isActive = flowController.navigation.activePage === this;
      this.isBusy = this.isActive && flowController.navigation.isPending;

      // also update reactive state for child components
      this.pageController$.setValue(value => {
        value.isActive = this.isActive;
        value.isBusy = this.isBusy;
      });
    });
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
      <h2>${this.heading}</h2>
      <slot></slot>
    </div>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px solid #000;
      }

      :host([is-active]) {
        //display: block;
        padding: 16px;
        border: 3px solid red;
      }

      :host([is-busy]) {
        opacity: 0.3;
      }
    `;
  }
}
