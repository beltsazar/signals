import { LitElement, css, html } from "lit";
import { SignalsConsumerMixin } from "../../signals/index.js";

export class NextPageButton extends SignalsConsumerMixin(LitElement) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      label: { type: String },
      isBusy: { type: Boolean, attribute: "is-busy", reflect: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // get shared signals
    const { pageController$ } = this.getSignals();
    // put signals on the element scope
    this.pageController$ = pageController$;
    // watch pageController$ signal for changes to active child and update isActive property accordingly
    this.mapStateToSignals({
      isBusy: this.computed(this.pageController$, ({ value }) => {
        this.isBusy = value.navigation.isPending;
      }),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  nextPage() {
    this.pageController$.navigate(this.pageController$.nextChild);
  }

  render() {
    return html`<button @click="${this.nextPage}">${this.label}</h2></button>`;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        padding-bottom: 16px;
      }

      :host([is-busy]) {
        opacity: 0.3;
      }
    `;
  }
}
