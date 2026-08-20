import { isEqual } from "lodash-es";
import { LitElement } from "lit";
import { SignalsConsumerMixin } from "../../../../signals/index.js";

export class FlowComponent extends SignalsConsumerMixin(LitElement) {
  constructor() {
    super();
    this.initialFormData = null;
  }

  // called by page controller in onAfterEntering hook
  saveInitialFormData() {
    this.initialFormData = this.getSerializedFormData();
  }

  isFormDataChanged() {
    return !isEqual(this.initialFormData, this.getSerializedFormData());
  }

  getSerializedFormData() {
    const form = this.shadowRoot.querySelector("form");
    if (form) {
      return Object.fromEntries(new FormData(form));
    }
    return null;
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
