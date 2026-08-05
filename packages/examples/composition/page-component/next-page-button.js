import { css, html } from "lit";
import { PageElement } from "./page-element.js";

export class NextPageButton extends PageElement {
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
