import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { PageFlow } from "../generic/page-flow.js";
import { FlowPage } from "../generic/flow-page.js";
import { CustomFlowComponent } from "./custom-flow-component.js";
import { CustomFlowComponentAsync } from "./custom-flow-component-async.js";
import { PreviousPageButton } from "../generic/components/previous-page-button.js";
import { NextPageButton } from "../generic/components/next-page-button.js";
import { AdvanceButton } from "../generic/components/advance-button.js";
import { FlowProgress } from "../generic/components/flow-progress.js";

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
      state: { type: Object, state: true },
    };
  }

  static get scopedElements() {
    return {
      "page-flow": PageFlow,
      "flow-page": FlowPage,
      "flow-progress": FlowProgress,
      "previous-page-button": PreviousPageButton,
      "next-page-button": NextPageButton,
      "advance-page-button": AdvanceButton,
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
    // update the local state with updated state from the page flow component, wait for update to complete to prevent race conditions
    this.updateComplete.then(() => {
      this.state = e.detail.state;
    });
  }

  addProfession() {
    this.state = { ...this.state, profession: "Programmer" };
  }

  showConditionalPage() {
    const showConditionalPage = !this.state.showConditionalPage;
    this.state = { ...this.state, showConditionalPage };
  }

  showConditionalPageGroup() {
    const showConditionalPageGroup = !this.state.showConditionalPageGroup;
    this.state = { ...this.state, showConditionalPageGroup };
  }

  showConditionalPageInsideGroup() {
    const showConditionalPageInsideGroup =
      !this.state.showConditionalPageInsideGroup;
    this.state = { ...this.state, showConditionalPageInsideGroup };
  }

  render() {
    return html`
      <page-flow active-page-id="1" heading="Page Flow" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <flow-progress></flow-progress>
        <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
        <button @click="${this.addProfession}">Add Profession</button>
        <previous-page-button label="Previous Page"></previous-page-button>
        <next-page-button label="Next Page"></next-page-button>
        <advance-page-button label="Proceed"></advance-page-button>
        <flow-page id="1" heading="Page 1">Slotted Content ...</flow-page>
        <flow-page id="2" heading="Page 2"
          >Slotted Content ...<div slot="pages"><flow-page id="3" heading="Page 3 nested inside page 2"
            >Slotted Content ...<div slot="pages"><flow-page id="4"
              heading="Page 4 nested inside 3"
              >Slotted Content ...<custom-flow-component heading="Custom page"
                ><next-page-button
                  label="Next Page"
                ></next-page-button></custom-flow-component></div></flow-page></div></flow-page
        ></flow-page>
        <flow-page id="5" heading="Page 5"
          >Slotted Content ...
          <custom-flow-component-async
            heading="Custom page with async content"
            ><next-page-button label="Next Page"></next-page-button
          ></custom-flow-component-async>
        </flow-page>
        <flow-page id="6" heading="Page 6">Slotted Content ... <button @click="${this.showConditionalPage}">Toggle conditional page</button></flow-page>
        <flow-page id="7" heading="Conditional Page 7" .options="${{ condition: state => state.showConditionalPage }}">Slotted Content ...
          <button @click="${this.showConditionalPageGroup}">Toggle conditional page group</button></flow-page>
        <flow-page id="8" heading="Conditional Page Group 8" .options="${{ condition: state => state.showConditionalPageGroup }}">Slotted Content ...
        <div slot="pages">
          <flow-page id="9" heading="Nested Page 9">Slotted Content ...<button @click="${this.showConditionalPageInsideGroup}">Toggle conditional page inside group</button></flow-page>
          <flow-page id="10" heading="Nested Page 10" .options="${{ condition: state => state.showConditionalPageInsideGroup }}">Slotted Content ...</flow-page>
          <flow-page id="11" heading="Nested Page 11">Slotted Content ...</flow-page>
        </div>
     </flow-page>
        <flow-page id="12" heading="Last Page 12">Slotted Content ...</flow-page>
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
