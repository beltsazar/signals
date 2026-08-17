import { LitElement, css, html } from "lit";
import { SignalsProviderMixin, isEqual } from "../../../../signals/index.js";
import { FlowController } from "./controllers/FlowController.js";

export class PageFlow extends SignalsProviderMixin(LitElement) {
  flowController$ = new FlowController(this);
  state$;

  constructor() {
    super();
    this.state = {};
    this.activePageId = null;
  }

  static get properties() {
    return {
      activePageId: { type: String, attribute: "active-page-id" },
      heading: { type: String },
      state: { type: Object },
      _flowController: { type: Object, state: true },
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
      flowController$: this.flowController$,
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

    this.mapStateToSignals({
      _flowController: this.computed(
        this.flowController$,
        ({ value }) => value.navigation,
      ),
    });

    // wait for child components to complete initialization
    await this.updateComplete;

    // navigate to start page
    if (this.activePageId) {
      await this.flowController$.commitPage(
        this.flowController$.getPageById(this.activePageId),
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <slot name="heading"></slot>
      <slot></slot>
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
