import { LitElement, css, html } from "lit";
import {
  SignalsProviderMixin,
  SignalsConsumerMixin,
} from "../../../../signals/index.js";
import { PageController } from "./controllers/PageController.js";

export class FlowPage extends SignalsProviderMixin(
  SignalsConsumerMixin(LitElement),
) {
  pageController$ = new PageController(this);

  constructor() {
    super();
    this.isActive = false;
    this.isAdvanced = false;
    this.isCompleted = false;
    this.isVisited = false;
    this.isBusy = false;
    this.hasActiveChildPage = false;
    this.options = null;
  }

  static get properties() {
    return {
      heading: { type: String },
      options: { type: Object },
      isActive: { type: Boolean, attribute: "is-active", reflect: true },
      isAdvanced: { type: Boolean, attribute: "is-advanced", reflect: true },
      isCompleted: { type: Boolean, attribute: "is-completed", reflect: true },
      isVisited: { type: Boolean, attribute: "is-completed", reflect: true },
      isBusy: { type: Boolean, attribute: "is-busy", reflect: true },
      hasActiveChildPage: {
        type: Boolean,
        attribute: "has-active-child-page",
        reflect: true,
      },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    /**
     * Get upstream signals: state$, flowController$ and possibly a parent pageController$
     */
    const {
      flowController$,
      pageController$: parentPageController$,
      state$,
    } = this.getSignals();

    /**
     * Set downstream signals: state$, flowController$ and pageController$ of this page
     */
    this.setSignals({
      pageController$: this.pageController$,
      flowController$,
      state$,
    });

    // use the flowController and possible parent pageController inside this component
    this.flowController$ = flowController$;
    this.parentPageController$ = parentPageController$;
    this.state$ = state$;

    /**
     * Register this page to its parent:
     * 1) flowController$ as the root, or a
     * 2) pageController$ as a parent when inside a nested page
     */
    if (parentPageController$) {
      parentPageController$.registerPage(this);
    } else {
      this.flowController$.registerPage(this);
    }

    // map reactive properties to the local pageController$ state
    this.mapStateToSignals({
      isActive: this.computed(
        this.pageController$,
        ({ value }) => value.isActive,
      ),
      isAdvanced: this.computed(
        this.pageController$,
        ({ value }) => value.isAdvanced,
      ),
      isCompleted: this.computed(
        this.pageController$,
        ({ value }) => value.isCompleted,
      ),
      isVisited: this.computed(
        this.pageController$,
        ({ value }) => value.isVisited,
      ),
      hasActiveChildPage: this.computed(
        this.pageController$,
        ({ value }) => value.hasActiveChildPage,
      ),
      isBusy: this.computed(this.pageController$, ({ value }) => value.isBusy),
    });

    // Watch the flowController$ for navigation updates
    this.pageController$.watchFlowController(flowController$);

    // wait for child components to complete initialization!!!
    await this.updateComplete;

    // watch for child page controllers state changes
    this.pageController$.watchChildPageControllers();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * onBeforeLeaving Hook
   * @returns {Promise<this is *[]>}
   */
  async onBeforeLeaving() {
    const onBeforeLeaving = [];
    this.pageController$.components.forEach(component => {
      if (component.onBeforeLeaving) {
        onBeforeLeaving.push(component.onBeforeLeaving?.());
      }
    });
    await Promise.all(onBeforeLeaving);
    return onBeforeLeaving.every(value => value);
  }

  /**
   * onBeforeEntering Hook
   * @returns {Promise<this is *[]>}
   */
  async onBeforeEntering() {
    const onBeforeEntering = [];
    this.pageController$.components.forEach(component => {
      if (component.onBeforeEntering) {
        onBeforeEntering.push(component.onBeforeEntering?.());
      }
    });
    await Promise.all(onBeforeEntering);
    return onBeforeEntering.every(value => value);
  }

  /**
   * onAfterEntering Hook
   * Page has become visible and ready for user interaction or DOM manipulation
   */
  async onAfterEntering() {
    this.pageController$.components.forEach(component => {
      component.onAfterEntering?.();
    });
  }

  /**
   * Check options object for conditional rendering of this page
   * If condition is not defined, always show this page
   * If condition is defined, show this page only when condition is true
   * @returns {boolean}
   */
  isConditionValid() {
    if (this.options?.condition) {
      return this.options.condition(this.state$.value) ?? false;
    }
    return true;
  }

  /**
   * Only show this page own content when active, but always allow nested pages to become visible
   * @returns {TemplateResult<1>}
   */
  render() {
    const breadCrumb = this.parentPageController$?.component.heading;
    return html`
      ${
        this.isActive
          ? html` ${breadCrumb ? html`<p><em>${breadCrumb}</p></em>` : ""}
              <h2>${this.heading}</h2>
              <slot></slot>`
          : ""
      }
      <slot name="pages"></slot>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: none;
      }

      :host([is-active]) {
        display: block;
        padding: 16px;
        border: 1px dashed #000;
      }

      :host([has-active-child-page]) {
        display: block;
      }

      :host([is-busy]) {
        opacity: 0.3;
      }
    `;
  }
}
