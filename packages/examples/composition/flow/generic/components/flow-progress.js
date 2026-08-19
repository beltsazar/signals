import { css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { FlowComponent } from "../flow-component.js";

export class FlowProgress extends FlowComponent {
  constructor() {
    super();
    this.navigationStatus = {};
    this.navigationPages = [];
  }

  static get properties() {
    return {
      navigationPages: { type: Array, state: true },
      navigationStatus: { type: Object, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.initialWatcher = this.watch(this.flowController$, () => {
      const flattenedPages = this.flowController$.flattenedPages;

      // if the flowController$ has pages, watch the pageControllers
      if (flattenedPages.length > 0) {
        const pageControllers = flattenedPages.map(
          page => page.pageController$,
        );

        // watch the pageControllers for any changes and trigger rerender of the navigation pages
        this.watch([...pageControllers, this.state$], () => {
          this.navigationPages = [...this.flowController$.navigationPages];
        });

        // dispose the watcher after the first time it fires
        this.initialWatcher?.dispose?.();
      }
    });

    this.mapStateToSignals({
      navigationStatus: this.computed(
        [this.flowController$],
        () => this.flowController$.value.navigation,
      ),
    });
  }

  navigatePage(page) {
    this.flowController$.navigatePage(page);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispose();
  }

  render() {
    return html`<p>
        Page
        ${this.flowController$.getNavigationPageIndex(this.navigationStatus?.activePage) + 1}
        from ${this.navigationPages.length} pages
      </p>
      <div>
        ${this.navigationPages.map((page, index) => {
          // extract state from signal, NOT from the component itself
          const { isActive, isAdvanced, isCompleted, isVisited, isBlocked } =
            page.pageController$.value;

          const classes = {
            active: isActive,
            advanced: isAdvanced,
            completed: isCompleted,
            visited: isVisited,
            blocked: isBlocked,
          };

          return html`${
            isVisited && !isBlocked
              ? html`<button
                  href="#"
                  @click="${() => this.navigatePage(page)}"
                  class="navigate ${classMap(classes)}"
                >
                  ${index + 1}
                </button>`
              : html`<button class=${classMap(classes)}>${index + 1}</button>`
          }`;
        })}
      </div> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px dotted #000;
      }

      div {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      button {
        flex-grow: 1;
        border: 2px dashed lightgray;
        text-align: center;
      }

      .visited {
        border: 2px solid black;
      }

      .active {
        background-color: red;
      }

      .completed {
        background-color: green;
        color: white;
      }

      .advanced {
        border: 2px dashed black;
      }

      .blocked {
        opacity: 0.5;
      }

      .active.completed {
        background-color: red;
        color: black;
      }

      .active.advanced {
        border: 2px solid black;
      }

      .navigate:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 1px grey;
      }
    `;
  }
}
