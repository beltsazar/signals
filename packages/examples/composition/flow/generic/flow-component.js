import { LitElement } from "lit";
import { SignalsConsumerMixin } from "../../../../signals/index.js";

export class FlowComponent extends SignalsConsumerMixin(LitElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    // get shared signals
    const { flowController$, pageController$, state$ } = this.getSignals();

    if (pageController$) {
      pageController$.registerComponent(this);
    }

    // put signals on the element scope
    this.flowController$ = flowController$;
    this.pageController$ = pageController$ ?? null;
    this.state$ = state$;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
