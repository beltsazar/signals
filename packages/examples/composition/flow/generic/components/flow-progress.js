import { css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { FlowComponent } from "../flow-component.js";

export class FlowProgress extends FlowComponent {
  constructor() {
    super();
    this.activePageIndex = 0;
    this.advancedPageIndex = 0;
    this.navigationPages = 0;
  }

  static get properties() {
    return {
      activePageIndex: { type: Number, state: true },
      advancedPageIndex: { type: Number, state: true },
      navigationPages: { type: Number, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.mapStateToSignals({
      activePageIndex: this.computed(
        [this.flowController$, this.state$],
        () => this.flowController$.activePageIndex,
      ),
      advancedPageIndex: this.computed(
        [this.flowController$, this.state$],
        () => this.flowController$.advancedPageIndex,
      ),
      navigationPages: this.computed(
        [this.flowController$, this.state$],
        () => this.flowController$.navigationPages,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`Page ${this.activePageIndex + 1} from
      ${this.navigationPages.length} pages
      <div>
        ${this.navigationPages.map((page, index) => {
          const classes = {
            activePage: index === this.activePageIndex,
            advancedPage: index <= this.advancedPageIndex,
          };
          return html`<p class=${classMap(classes)}></p>`;
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
        border: 4px solid lightgray;
        height: 10px;
      }

      p.activePage {
        border: 4px solid red;
        background-color: red;
      }

      p.advancedPage {
        background-color: black;
      }

      p.activePage.advancedPage {
        border: 4px solid red;
        background-color: red;
      }
    `;
  }
}
