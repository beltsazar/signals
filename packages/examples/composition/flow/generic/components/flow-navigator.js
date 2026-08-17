import { css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { FlowComponent } from "../flow-component.js";

export class FlowNavigator extends FlowComponent {
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

    // watch flowController$ until it has pages and start to watch ALL pages for navigation changes
    const initialWatcher = this.watch(this.flowController$, () => {
      const flattenedPages = this.flowController$.flattenedPages;

      // if the flowController$ has pages, watch the pageControllers
      if (flattenedPages.length > 0) {
        const pageControllers = flattenedPages.map(
          page => page.pageController$,
        );

        // watch the pageControllers for any changes and trigger rerender of the navigation pages
        this.watch([...pageControllers, this.state$], () => {
          this.navigationPages = [
            ...this.flowController$.nestedNavigationPages,
          ];
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

  navigatePage(e, page) {
    this.flowController$.navigatePage(page);
    e.preventDefault();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  renderPageList(pages) {
    return html`<ul>
      ${pages.map(page => {
        if (Array.isArray(page)) {
          return html`<li>${this.renderPageList(page)}</li>`;
        }

        // extract state from signal, NOT from the component itself
        const { isActive, isAdvanced, isCompleted, isVisited } =
          page.pageController$.value;

        const classes = {
          active: isActive,
          advanced: isAdvanced,
          completed: isCompleted,
          visited: isVisited,
        };

        return html`${
          isVisited
            ? html`<li>
                <a
                  href="#"
                  @click="${e => this.navigatePage(e, page)}"
                  class="navigate ${classMap(classes)}"
                >
                  ${page.heading}
                </a>
              </li>`
            : html`<li>
                <p class=${classMap(classes)}>${page.heading}</p>
              </li>`
        }`;
      })}
    </ul>`;
  }

  render() {
    return html` <div>${this.renderPageList(this.navigationPages)}</div> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px dotted #000;
      }

      div {
        display: block;
        justify-content: space-between;
        gap: 10px;
      }

      button {
        display: block;
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
