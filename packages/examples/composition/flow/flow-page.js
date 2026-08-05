import { css, html } from "lit";
import { FlowComponent } from "./flow-component.js";

export class FlowPage extends FlowComponent {
  constructor() {
    super();
    this.isActive = false;
    this.isBusy = false;
  }

  static get properties() {
    return {
      heading: { type: String },
      isActive: { type: Boolean, attribute: "is-active", reflect: true },
      isBusy: { type: Boolean, attribute: "is-busy", reflect: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    // register this component with the page controller so that it can be managed by the controller
    this.pageController$.registerChildComponent(this);

    // watch pageController$ signal for changes to active child and update isActive property accordingly
    this.watch(this.pageController$, ({ value }) => {
      this.isActive = value.navigation.activeChild === this;
      this.isBusy = this.isActive && value.navigation.isPending;
      // other actions
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // eslint-disable-next-line class-methods-use-this
  onBeforeLeaving() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  onBeforeEntering() {
    return true;
  }

  render() {
    return html`<div>
      <h2>${this.heading}</h2>
      <slot></slot>
    </div>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px solid #000;
      }

      :host([is-active]) {
        padding: 16px;
        border: 3px solid red;
      }

      :host([is-busy]) {
        opacity: 0.3;
      }
    `;
  }
}
