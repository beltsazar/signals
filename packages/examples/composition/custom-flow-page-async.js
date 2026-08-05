import { html } from "lit";
import { FlowPage } from "./flow/flow-page.js";

export class CustomFlowPageAsync extends FlowPage {
  constructor() {
    super();
  }

  static properties = {
    ...super.properties,
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
    return await this.getData();
  }

  render() {
    return html`<h2>${this.heading}</h2>
    ${this.isActive ? html`<strong>Activated!!!!</strong>` : ""}
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
    <slot></slot>`;
  }
}
