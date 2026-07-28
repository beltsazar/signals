import { html } from "lit";
import { PageComponent } from "./page-component.js";

export class CustomPageComponentAsync extends PageComponent {
  constructor() {
    super();
  }

  static properties = {
    ...super.properties,
    state: { type: Boolean, state: true },
  };

  connectedCallback() {
    super.connectedCallback();

    this.mapStateToSignals({
      state: this.state$,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  getData() {
    let resolver;
    const deferred = new Promise(resolve => (resolver = resolve));
    setTimeout(() => {
      this.state$.setValue(value => {
        value.address = {
          street: "Coronation Street",
          number: 77,
        };
      });
      resolver(true);
    }, 2000);
    return deferred;
  }

  async onBeforeEntering() {
    return await this.getData();
  }

  navigate() {
    this.pageController$.navigate(this.pageController$.nextChild);
  }

  render() {
    return html`<h2>${this.heading}</h2>
    ${this.isActive ? html`<strong>Activated!!!!</strong>` : ""}
    <p>State: <pre>${JSON.stringify(this.state, null, 2)}</pre></p>
    <button @click="${() => this.navigate()}">Navigate Child Components</button>`;
  }
}
