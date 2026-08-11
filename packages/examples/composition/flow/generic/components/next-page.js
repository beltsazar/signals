import { css, html } from "lit";
import { FlowComponent } from "../flow-component.js";

export class NextPage extends FlowComponent {
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
      isDisabled: this.computed(
        [this.flowController$, this.state$],
        ([{ value }]) => {
          return (
            value.navigation.isPending || this.flowController$.nextPage === null
          );
        },
      ),
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

      :host([is-disabled]) {
        opacity: 0.3;
      }
    `;
  }
}
