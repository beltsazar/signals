import { css, html } from "lit";
import { FlowComponent } from "../generic/flow-component.js";

export class CustomFlowComponent2 extends FlowComponent {
  constructor() {
    super();
  }

  onBeforeLeaving() {
    this.state$.setValue(value => {
      value.showConditionalPageInsideGroup = true;
    });
    return true;
  }

  render() {
    return html`Add conditional page directly after this page and navigate to it directly!`;
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
