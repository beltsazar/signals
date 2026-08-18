import { LitElement, css, html } from "lit";
import { cache } from "lit/directives/cache.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { PageFlow } from "../generic/page-flow.js";
import { FlowPage } from "../generic/flow-page.js";
import { CustomFlowComponent } from "./custom-flow-component.js";
import { CustomFlowComponent2 } from "./custom-flow-component-2.js";
import { CustomFlowComponentAsync } from "./custom-flow-component-async.js";
import { PreviousPageButton } from "../generic/components/previous-page-button.js";
import { NextPageButton } from "../generic/components/next-page-button.js";
import { FlowProgress } from "../generic/components/flow-progress.js";
import { FlowNavigator } from "../generic/components/flow-navigator.js";

export class FlowDemo extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.state = {
      user: "John Doe",
      age: 27,
    };
    this.isCacheViewShown = true;
  }

  static get properties() {
    return {
      state: { type: Object, state: true },
      isCacheViewShown: { type: Number, state: true },
    };
  }

  static get scopedElements() {
    return {
      "page-flow": PageFlow,
      "flow-page": FlowPage,
      "flow-navigator": FlowNavigator,
      "flow-progress": FlowProgress,
      "previous-page-button": PreviousPageButton,
      "next-page-button": NextPageButton,
      "custom-flow-component": CustomFlowComponent,
      "custom-flow-component-2": CustomFlowComponent2,
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

  renderPageFlow() {
    return html`<page-flow start-page-id="1" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <div slot="heading"><h1>Page Flow</h1>
          <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
          <button @click="${this.addProfession}">Add Profession</button>
        </div>
        <div><flow-progress></flow-progress></div>
        <div class="container">
          <flow-navigator ></flow-navigator>
          <div class="pages">
            <flow-page id="1" heading="Page 1">Slotted Content ...</flow-page>
            <flow-page id="2" heading="Page 2" has-content
              >Slotted Content ...
              <div slot="pages">
                <flow-page id="3" heading="Page 3 nested inside page 2" has-content
                  >Slotted Content ...
                  <div slot="pages">
                    <flow-page id="4"
                      heading="Page 4 nested inside 3"
                      >Slotted Content ...<custom-flow-component heading="Custom page"></custom-flow-component>
                    </flow-page>
                  </div>
                </flow-page>
              </div>
            </flow-page>
            <flow-page id="5" heading="Page 5"
              >Slotted Content ...
              <custom-flow-component-async
                heading="Custom page with async content"
              </custom-flow-component-async>
            </flow-page>
            <flow-page id="6" heading="Page 6">Slotted Content ... <button @click="${this.showConditionalPage}">Toggle conditional page</button></flow-page>
            <flow-page id="7" heading="Conditional Page 7" .options="${{ condition: state => state.showConditionalPage }}">Slotted Content ...
              <button @click="${this.showConditionalPageGroup}">Toggle conditional page group</button></flow-page>
            <flow-page id="8" heading="Conditional Page Group 8" .options="${{ condition: state => state.showConditionalPageGroup }}">Slotted Content ...
              <div slot="pages">
                <flow-page id="9" heading="Nested Page 9">
                  <custom-flow-component-2></custom-flow-component-2>
                </flow-page>
                <flow-page id="10" heading="Conditional Nested Page 10" .options="${{ condition: state => state.showConditionalPageInsideGroup }}">Slotted Content ...</flow-page>
                <flow-page id="11" heading="Nested Page 11">Slotted Content ...</flow-page>
              </div>
            </flow-page>
            <flow-page id="12" heading="Last Page 12">Slotted Content ...</flow-page>
          </div>
        </div>
        <div class="buttons">
          <previous-page-button label="Previous Page"></previous-page-button>
          <next-page-button label="Next Page"></next-page-button>
        </div>
      </page-flow>
  `;
  }

  toggleCacheView() {
    this.isCacheViewShown = !this.isCacheViewShown;
  }

  render() {
    return html` <p>
        <button @click=${this.toggleCacheView}>Toggle Template Cache</button>
      </p>
      ${cache(this.isCacheViewShown ? this.renderPageFlow() : html`<div>Click a gain to switch back ...</div>`)}`;
  }

  static get styles() {
    return css`
      :host {
        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }

      :host div {
        margin-bottom: 16px;
      }

      .container,
      .buttons {
        display: flex;
        gap: 16px;
      }

      .pages {
        flex-grow: 1;
      }

      .buttons {
        justify-content: space-between;
      }
    `;
  }
}
