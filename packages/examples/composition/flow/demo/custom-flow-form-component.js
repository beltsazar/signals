import { css, html } from "lit";
import { FlowComponent } from "../generic/flow-component.js";

export class CustomFlowFormComponent extends FlowComponent {
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

  onAfterEntering() {}

  onBeforeLeaving() {
    this.state$.setValue(value => {
      value.person = this.getSerializedFormData();
    });
    return true;
  }

  render() {
    return html`
      <form
        name="form"
        @submit=${e => {
          this._onSubmit(e);
        }}
      >
        <fieldset>
          <legend>Please fill out your name:</legend>
            <p><label>First name</label>
            <input type="text" name="firstName" />
            </p><p>
            <label>Last name</label>
            <input type="text" name="lastName" />
        </p>
        </fieldset>
      </form>
          
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
   `;
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
