import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { FlowPages } from "../generic/flow-pages.js";
import { FlowPage } from "../generic/flow-page.js";
import { CustomFlowComponent } from "./custom-flow-component.js";
import { CustomFlowComponentAsync } from "./custom-flow-component-async.js";
import { FlowNextPageButton } from "../generic/flow-next-page-button.js";

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
      "custom-flow-component": CustomFlowComponent,
      "custom-flow-component-async": CustomFlowComponentAsync,
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
      <flow-pages active-page-id="1" heading="Page Flow" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
        <button @click="${this.addProfession}">Add Profession</button>
        <flow-next-page-button label="Next Page"></flow-next-page-button>
        <flow-page id="1" heading="Page 1"><div slot="content">Slotted Content ...</div></flow-page>
        <flow-page id="2" heading="Page 2"
          ><div slot="content">Slotted Content ...</div><div slot="pages"><flow-page id="3" heading="Page 3 nested inside page 2"
            ><div slot="content">Slotted Content ...</div><div slot="pages"><flow-page id="4"
              heading="Page 4 nested inside 3"
              ><div slot="content">Slotted Content ...<custom-flow-component heading="Custom page"
                ><flow-next-page-button
                  label="Next Page"
                ></flow-next-page-button></custom-flow-component></div></flow-page></div></flow-page
        ></div></flow-page>
        <flow-page id="5" heading="Page 5"
          ><div slot="content">Slotted Content ...
          <custom-flow-component-async
            heading="Custom page with async content"
            ><flow-next-page-button label="Next Page"></flow-next-page-button
          ></custom-flow-component-async></div>
        </flow-page>
        <flow-page id="1" heading="Page 6"><div slot="content">Slotted Content ...</div></flow-page>
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
