import { LitElement } from "lit";
import { SignalsConsumerMixin } from "../../../signals/index.js";

export class PageElement extends SignalsConsumerMixin(LitElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // get shared signals
    const { pageController$, state$ } = this.getSignals();

    // put signals on the element scope
    this.pageController$ = pageController$;
    this.state$ = state$;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
