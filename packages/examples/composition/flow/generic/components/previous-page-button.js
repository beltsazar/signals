import { css, html } from "lit";
import { FlowComponent } from "../flow-component.js";

export class PreviousPageButton extends FlowComponent {
  constructor() {
    super();
  }

  static get properties() {
    return {
      label: { type: String },
      isDisabled: { type: Boolean, attribute: "is-disabled", reflect: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.mapStateToSignals({
      isDisabled: this.computed(this.flowController$, ({ value }) => {
        return (
          value.navigation.isPending ||
          this.flowController$.previousPage === null
        );
      }),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  previousPage() {
    this.flowController$.navigatePage(this.flowController$.previousPage);
  }

  render() {
    return html`<button @click="${this.previousPage}">${this.label}</h2></button>`;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        padding-bottom: 16px;
      }

      :host([is-disabled]) {
        opacity: 0.3;
      }
    `;
  }
}
