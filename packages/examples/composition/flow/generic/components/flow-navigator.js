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
    this.initialWatcher = this.watch(this.flowController$, () => {
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

  navigatePage(e, page) {
    this.flowController$.navigatePage(page);
    e.preventDefault();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.dispose();
  }

  renderPageList(pages) {
    return html`<ul>
      ${pages.map(page => {
        if (Array.isArray(page)) {
          return html`<li>${this.renderPageList(page)}</li>`;
        }

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

        // check if the page is a group (has subpages)
        const isGroup = page.pageController$.pages.size > 0;
        // if the page is a group, it is only navigable if it has content
        const isNavigable =
          (isGroup ? isVisited && page.hasContent : isVisited) && !isBlocked;

        return html`${
          isNavigable
            ? html`<li>
                <a
                  href="#"
                  @click="${e => this.navigatePage(e, page)}"
                  class="navigate ${classMap(classes)}"
                  >${page.heading}</a
                >
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

      ul,
      li {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li {
        margin-bottom: 16px;
        padding-left: 16px;
      }

      div > ul > li {
        padding-left: 0;
      }

      p,
      a {
        display: block;
        padding: 4px 12px 4px 8px;
        color: lightgray;
      }

      .visited {
        color: black;
      }

      .active {
        border-right: 10px solid red;
        color: red;
        font-weight: bold;
      }

      .completed {
        border-right: 10px solid green;
        color: green;
      }

      .advanced {
        border-right: 10px solid black;
        font-weight: bold;
      }

      .blocked {
        opacity: 0.5;
      }

      .active.completed {
        border-right: 10px solid red;
        color: red;
        font-weight: bold;
      }

      .active.advanced {
        border-right: 10px solid red;
      }

      .navigate:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 1px grey;
      }
    `;
  }
}
