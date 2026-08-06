import { css, html } from "lit";
import { FlowComponent } from "./flow/generic/flow-component.js";

export class CustomFlowComponentAsync extends FlowComponent {
  constructor() {
    super();
  }

  static properties = {
    state: { type: Boolean, state: true },
  };

  connectedCallback() {
    super.connectedCallback();

    this.mapStateToSignals({
      state: this.state$,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  getData() {
    let resolver;
    const deferred = new Promise(resolve => (resolver = resolve));
    setTimeout(() => {
      this.state$.setValue(value => {
        value.address = {
          street: "Coronation Street",
          number: 77,
        };
      });
      resolver(true);
    }, 2000);
    return deferred;
  }

  async onBeforeEntering() {
    await this.getData();
    return true;
  }

  render() {
    return html`<h2>${this.heading}</h2>
    ${this.isActive ? html`<strong>Activated!!!!</strong>` : ""}
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
    <slot></slot>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px dotted #000;
      }
    `;
  }
}
