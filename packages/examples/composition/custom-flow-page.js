import { css, html } from "lit";
import { FlowComponent } from "./flow/flow-component.js";

export class CustomFlowPage extends FlowComponent {
  constructor() {
    super();
  }

  static properties = {
    ...super.properties,
    state: { type: Boolean, state: true },
    isValidationMessageShown: { type: Boolean },
  };

  connectedCallback() {
    super.connectedCallback();

    // validation state
    this.validation$ = this.signal({
      isValidated: false,
      isValid: false,
    });

    this.mapStateToSignals({
      state: this.state$,
      isValidationMessageShown: this.computed(
        this.validation$,
        ({ value }) => value.isValidated && !value.isValid,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  validate() {
    // the page is only valid when updated property is available
    const isValid = !!this.state.updated;
    // update the
    this.validation$.setValue({
      isValidated: true,
      isValid,
    });
    return isValid;
  }

  onBeforeLeaving() {
    return this.validate();
  }

  updateState() {
    this.state$.setValue(state => {
      state.updated = true;
    });
    this.validate();
  }

  render() {
    return html`<h2>${this.heading}</h2>
    ${this.isActive ? html`<strong>Activated!!!!</strong>` : ""}
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
    ${this.isValidationMessageShown ? html`<p><strong>Update state before going to next step!</strong></p>` : ""}
    <button @click="${() => this.updateState()}">Update State</button>
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
