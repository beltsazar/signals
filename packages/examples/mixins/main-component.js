import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsProviderMixin } from "../../signals/index.js";
import { IntermediateChildComponent } from "./intermediate-child-component.js";

export class MainComponent extends SignalsProviderMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      signalValue: { type: String, state: true },
    };
  }

  static get scopedElements() {
    return {
      "intermediate-child-component": IntermediateChildComponent,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.testSignal$ = this.signal("Signal from Main Component");
    this.setSignals({ testSignal$: this.testSignal$ });
    this.mapStateToSignals({ signalValue: this.testSignal$ });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h1>Main Component</h1>
      <p>Providing shared signals to children</p>
      <blockquote><code>Provided: ${this.signalValue}</code></blockquote>
      <intermediate-child-component></intermediate-child-component> `;
  }

  static get styles() {
    return css`
      :host {
        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }
    `;
  }
}
