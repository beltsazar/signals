import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import {
  SignalsProviderMixin,
  SignalsConsumerMixin,
} from "../../signals/index.js";
import { ChildComponent } from "./child-component.js";

export class IntermediateChildComponent extends SignalsProviderMixin(
  SignalsConsumerMixin(ScopedElementsMixin(LitElement)),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {};
  }

  static get scopedElements() {
    return {
      "child-component": ChildComponent,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const sharedSignals = this.signals;
    // eslint-disable-next-line
    console.log("sharedSignals:", sharedSignals);
    this.testSignal2$ = this.signal(2);
    this.signals = { ...sharedSignals, testSignal2$: this.testSignal2$ };
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h2>Intermediate Child Component</h2>
      <p>
        Consuming shared signals from DIRECT parent component AND Providing
        shared signals to children
      </p>
      <child-component></child-component> `;
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
