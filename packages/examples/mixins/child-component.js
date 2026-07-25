import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsConsumerMixin } from "../../signals/index.js";

export class ChildComponent extends SignalsConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {};
  }

  connectedCallback() {
    super.connectedCallback();
    const sharedSignals = this.signals;
    // eslint-disable-next-line
    console.log("sharedSignals:", sharedSignals);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h3>Child Component</h3>
      <p>Consuming shared signals from DIRECT parent component</p> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }
    `;
  }
}
