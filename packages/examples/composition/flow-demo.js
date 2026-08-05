import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { FlowPages } from "./flow/flow-pages.js";
import { FlowPage } from "./flow/flow-page.js";
import { CustomFlowPage } from "./custom-flow-page.js";
import { CustomFlowPageAsync } from "./custom-flow-page-async.js";
import { FlowNextPageButton } from "./flow/flow-next-page-button.js";

export class FlowDemo extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.state = {
      user: "John Doe",
      age: 27,
    };
  }

  static get properties() {
    return {
      state: { type: Object },
    };
  }

  static get scopedElements() {
    return {
      "flow-pages": FlowPages,
      "flow-page": FlowPage,
      "flow-next-page-button": FlowNextPageButton,
      "custom-flow-page": CustomFlowPage,
      "custom-flow-page-async": CustomFlowPageAsync,
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updateState(e) {
    // update the local state with updated state from the page flow component
    this.state = e.detail.state;
  }

  addProfession() {
    this.state = { ...this.state, profession: "Programmer" };
  }

  render() {
    return html`
      <flow-pages heading="Page Container" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
        <button @click="${this.addProfession}">Add Profession</button>
        <flow-next-page-button label="Next Page"></flow-next-page-button>
        <flow-page heading="Page Component 1">Content ...</flow-page>
        <flow-page heading="Page Component 2"
          >Content ...<flow-page heading="Page Component 3 nested inside 2"
            >Content...<flow-page
              heading="Page Component 4 nested inside 3"
              >Content...<custom-flow-page heading="Custom page component"
                ><flow-next-page-button
                  label="Next Page"
                ></flow-next-page-button></custom-flow-page></flow-page></flow-page
        ></flow-page>
        <flow-page heading="Page Component 3"
          >Content ...
          <custom-flow-page-async
            heading="Custom page component with async content"
            ><flow-next-page-button label="Next Page"></flow-next-page-button
          ></custom-flow-page-async>
        </flow-page>
        <flow-page heading="Page Component 4">Content ...</flow-page>
      </flow-pages>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
}
