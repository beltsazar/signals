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
    return {
      signalValue1: { type: String, state: true },
      signalValue2: { type: String, state: true },
      signalValue3: { type: String, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const sharedSignals = this.getSignals();
    const localSignal$ = this.signal("Signal from Child Component");
    this.mapStateToSignals({
      signalValue1: sharedSignals.testSignal$,
      signalValue2: sharedSignals.testSignal2$,
      signalValue3: localSignal$,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h3>Child Component</h3>
      <p>Consuming shared signals from DIRECT parent component</p>
      <blockquote><code>Consumed: ${this.signalValue1}</code></blockquote>
      <blockquote><code>Consumed: ${this.signalValue2}</code></blockquote>
      <blockquote><code>Local: ${this.signalValue3}</code></blockquote> `;
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
