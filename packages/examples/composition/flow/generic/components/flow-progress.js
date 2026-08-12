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

    // watch flowController$ until it has pages and start to watch pages for navigation changes
    const initialWatcher = this.watch(this.flowController$, () => {
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
        initialWatcher.dispose();
      }
    });

    this.mapStateToSignals({
      navigationStatus: this.computed(
        [this.flowController$],
        () => this.flowController$.value.navigation,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`Page
      ${this.flowController$.getNavigationPageIndex(this.navigationStatus?.activePage) + 1}
      from ${this.navigationPages.length} pages
      <div>
        ${this.navigationPages.map((page, index) => {
          const classes = {
            active: page.isActive,
            advanced: page.isAdvanced,
            completed: page.isCompleted,
            visited: page.isVisited,
          };
          return html`<p class=${classMap(classes)}>${index + 1}</p>`;
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

      p {
        flex-grow: 1;
        border: 2px dashed lightgray;
        text-align: center;
      }

      p.visited {
        border: 2px solid black;
      }

      p.active {
        background-color: red;
      }

      p.completed {
        background-color: green;
        color: white;
      }

      p.advanced {
        border: 2px dashed black;
      }

      p.active.completed {
        background-color: red;
        color: black;
      }

      p.active.advanced {
        border: 2px solid black;
      }
    `;
  }
}
