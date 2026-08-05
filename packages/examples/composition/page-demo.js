import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { PageContainer } from "./page-component/page-container.js";
import { PageComponent } from "./page-component/page-component.js";
import { CustomPageComponent } from "./custom-page-component.js";
import { CustomPageComponentAsync } from "./custom-page-component-async.js";
import { NextPageButton } from "./page-component/next-page-button.js";

export class PageDemo extends ScopedElementsMixin(LitElement) {
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
      "page-container": PageContainer,
      "page-component": PageComponent,
      "next-page-button": NextPageButton,
      "custom-page-component": CustomPageComponent,
      "custom-page-component-async": CustomPageComponentAsync,
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
      <page-container heading="Page Container" .state=${this.state} @state-updated="${e => this.updateState(e)}">
        <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
        <button @click="${this.addProfession}">Add Profession</button>
        <next-page-button label="Next Page"></next-page-button>
        <page-component heading="Page Component 1">Content ...</page-component>
        <page-component heading="Page Component 2"
          >Content ...<page-component heading="Page Component 3 nested inside 2"
            >Content...<page-component
              heading="Page Component 4 nested inside 3"
              >Content...<custom-page-component heading="Custom page component"
                ><next-page-button
                  label="Next Page"
                ></next-page-button></custom-page-component></page-component></page-component
        ></page-component>
        <page-component heading="Page Component 3"
          >Content ...
          <custom-page-component-async
            heading="Custom page component with async content"
            ><next-page-button label="Next Page"></next-page-button
          ></custom-page-component-async>
        </page-component>
        <page-component heading="Page Component 4">Content ...</page-component>
      </page-container>
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
