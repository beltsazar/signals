import { css, html } from "lit";
import { FlowComponent } from "./flow-component.js";

export class FlowNextPageButton extends FlowComponent {
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
      isBusy: this.computed(this.flowController$, ({ value }) => {
        this.isBusy = value.navigation.isPending;
      }),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  nextPage() {
    this.flowController$.navigate(this.flowController$.nextPage);
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
