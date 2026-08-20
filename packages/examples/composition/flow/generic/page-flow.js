import { LitElement, css, html } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { SignalsProviderMixin, isEqual } from "../../../../signals/index.js";
import { FlowController } from "./controllers/FlowController.js";

export class PageFlow extends SignalsProviderMixin(LitElement) {
  flowController$ = new FlowController(this);
  state$;
  dialogRef = createRef();

  constructor() {
    super();
    this.state = {};
    this.startPageId = null;
    this.isConnectedCallbackCalled = false;
  }

  static get properties() {
    return {
      startPageId: { type: String, attribute: "start-page-id" },
      heading: { type: String },
      state: { type: Object },
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

  showDialog() {
    let resolver;
    const deferred = new Promise(resolve => (resolver = resolve));
    const dialog = this.dialogRef.value;
    dialog.addEventListener("close", () => resolver(dialog.returnValue), {
      once: true,
    });
    dialog.showModal();
    return deferred;
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

    // wait for child components to complete initialization
    await this.updateComplete;

    // navigate to start page initially
    if (!this.isConnectedCallbackCalled) {
      const startPage =
        this.flowController$.getPageById(this.startPageId) ??
        this.flowController$.nextPage;
      await this.flowController$.advancePage(startPage);
    }

    this.isConnectedCallbackCalled = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispose();
  }

  render() {
    return html`
      <slot name="heading"></slot>
      <slot></slot>
      <dialog ${ref(this.dialogRef)} id="dialog" closedby="none">
        <h2>Warning!</h2>
        <p>
          You have changed data on this page, click "CANCEL" to stay on this
          page.
        </p>
        <p>
          Then use the "NEXT" button to save your changes and continue the flow
          from there.
        </p>
        <button commandfor="dialog" command="close" value="cancel">
          Cancel navigation
        </button>
        <button commandfor="dialog" command="close" value="confirm">
          Navigate anyway
        </button>
      </dialog>
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
