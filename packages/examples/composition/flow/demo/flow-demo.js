import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { PageFlow } from "../generic/page-flow.js";
import { FlowPage } from "../generic/flow-page.js";
import { CustomFlowComponent } from "./custom-flow-component.js";
import { CustomFlowComponentAsync } from "./custom-flow-component-async.js";
import { NextPageFlowComponent } from "../generic/components/next-page-flow-component.js";

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
      "page-flow": PageFlow,
      "flow-page": FlowPage,
      "next-page-flow-component": NextPageFlowComponent,
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
      <page-flow active-page-id="1" heading="Page Flow" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
        <button @click="${this.addProfession}">Add Profession</button>
        <next-page-flow-component label="Next Page"></next-page-flow-component>
        <flow-page id="1" heading="Page 1">Slotted Content ...</flow-page>
        <flow-page id="2" heading="Page 2"
          >Slotted Content ...<div slot="pages"><flow-page id="3" heading="Page 3 nested inside page 2"
            >Slotted Content ...<div slot="pages"><flow-page id="4"
              heading="Page 4 nested inside 3"
              >Slotted Content ...<custom-flow-component heading="Custom page"
                ><next-page-flow-component
                  label="Next Page"
                ></next-page-flow-component></custom-flow-component></div></flow-page></div></flow-page
        ></flow-page>
        <flow-page id="5" heading="Page 5"
          >Slotted Content ...
          <custom-flow-component-async
            heading="Custom page with async content"
            ><next-page-flow-component label="Next Page"></next-page-flow-component
          ></custom-flow-component-async>
        </flow-page>
        <flow-page id="1" heading="Page 6">Slotted Content ...</flow-page>
      </page-flow>
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
