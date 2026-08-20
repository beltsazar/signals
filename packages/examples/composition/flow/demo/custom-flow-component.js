import { css, html } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { FlowComponent } from "../generic/flow-component.js";

export class CustomFlowComponent extends FlowComponent {
  buttonRef = createRef();

  constructor() {
    super();
  }

  static properties = {
    state: { type: Boolean, state: true },
    isValidationMessageShown: { type: Boolean, state: true },
    isActive: { type: Boolean, state: true },
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
      isActive: this.computed(
        this.pageController$,
        ({ value }) => value.isActive,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  validate() {
    // the page is only valid when updated property is available
    const isValid = !!this.state.updated;
    // update the validation state
    this.validation$.setValue({
      isValidated: true,
      isValid,
    });
    return isValid;
  }

  onAfterEntering() {
    const button = this.buttonRef.value;
    button.focus();
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
    return html`
    ${this.isActive ? html`<strong>Activated!!!!</strong>` : ""}
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
    ${this.isValidationMessageShown ? html`<p><strong>Update state before going to next step!</strong></p>` : ""}
    <button ${ref(this.buttonRef)} @click="${() => this.updateState()}">Update State</button>
    <slot></slot>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px dotted #000;
      }

      button:focus {
        border: 3px solid red;
      }
    `;
  }
}
