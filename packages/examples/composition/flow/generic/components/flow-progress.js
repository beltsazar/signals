import { css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { FlowComponent } from "../flow-component.js";

export class FlowProgress extends FlowComponent {
  constructor() {
    super();
    this.activePageIndex = 0;
    this.progressPageIndex = 0;
    this.navigationPages = 0;
  }

  static get properties() {
    return {
      activePageIndex: { type: Number, state: true },
      progressPageIndex: { type: Number, state: true },
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
      progressPageIndex: this.computed(
        [this.flowController$, this.state$],
        () => this.flowController$.progressPageIndex,
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
            progressPage: index <= this.progressPageIndex,
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
        border: 4px solid #000;
        height: 10px;
      }

      p.activePage {
        border: 4px solid red;
        background-color: red;
      }

      p.activePage.progressPage {
        xborder: 2px solid red;
      }

      p.progressPage {
        background-color: green;
      }
    `;
  }
}
