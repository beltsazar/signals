import { LitElement, css, html } from "lit";
import { SignalsProviderMixin, isEqual } from "../../../signals/index.js";
import { FlowPagesController } from "./FlowPagesController.js";

export class FlowPages extends SignalsProviderMixin(LitElement) {
  pageController$ = new FlowPagesController(this);
  state$;

  constructor() {
    super();
    this.state = {};
    this.test = {};
  }

  static get properties() {
    return {
      heading: { type: String },
      state: { type: Object },
      test: { type: Object },
    };
  }

  /**
   * Update the internal state if it is different with an updated state from the consumer, consumer state is leading
   * @param changedProperties
   */
  updated(changedProperties) {
    if (
      changedProperties.has("state") &&
      !isEqual(this.state, this.state$.value)
    ) {
      this.state$.setValue(this.state);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    // create a signal based on initial state passed to the component, this will be used to manage the state of the page container and its children
    this.state$ = this.signal(this.state);
    // share signals with children
    this.setSignals({
      state$: this.state$,
      pageController$: this.pageController$,
    });
    this.watch(this.state$, () => {
      this.dispatchEvent(
        new CustomEvent("state-updated", {
          detail: {
            state: this.state$.value,
          },
        }),
      );
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h1>${this.heading}</h1>
      <p>number of children: ${this.pageController$.value.children.size}</p>
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
