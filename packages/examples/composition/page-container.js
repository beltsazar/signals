import { LitElement, css, html } from "lit";
import { SignalsProviderMixin } from "../../signals/index.js";
import { PageController } from "./PageController.js";

export class PageContainer extends SignalsProviderMixin(LitElement) {
  pageController$ = new PageController(this);
  state$;

  constructor() {
    super();
    this.state = {};
    this.childrenCount = 0;
  }

  static get properties() {
    return {
      heading: { type: String },
      initialState: { type: Object },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    // create a signal based on initial state passed to the component, this will be used to manage the state of the page container and its children
    this.state$ = this.signal(this.initialState);
    // share signals with children
    this.setSignals({
      state$: this.state$,
      pageController$: this.pageController$,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  navigate() {
    this.pageController$.navigate(this.pageController$.nextChild);
  }

  render() {
    return html`<h1>${this.heading}</h1>
      <p>number of children: ${this.pageController$.value.children.size}</p>
      <button @click="${() => this.navigate()}">
        Navigate Child Components
      </button>
      <slot></slot> `;
  }

  static get styles() {
    return css`
      :host {
        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }
    `;
  }
}
