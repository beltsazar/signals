import { LitElement, css, html } from "lit";
import { SignalsMixin } from "../../signals/index.js";

export class MixinComponent extends SignalsMixin(LitElement) {
  bookShopModel = {
    shop: "Bookshop",
    books: [
      {
        title: "Interesting Book",
        author: "Dickens",
        price: {
          currency: "euro",
          amount: 20,
        },
      },
      {
        title: "Boring Book",
        author: "Trump",
        price: {
          currency: "euro",
          amount: 0,
        },
      },
    ],
  };

  constructor() {
    super();
    this.simpleSignalValue = null;
    this.objectSignalValue = null;
  }

  static get properties() {
    return {
      simpleSignalValue: { type: String, state: true },
      objectSignalValue: { type: String, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.simpleSignal$ = this.signal(0);
    this.objectSignal$ = this.signal(this.bookShopModel);

    this.mapStateToSignals({
      simpleSignalValue: this.simpleSignal$,
      objectSignalValue: this.objectSignal$,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`<h1>Component using SignalsMixin</h1>
      <section>
        SimpleSignalValue:
        <pre>${this.simpleSignalValue}</pre>

        <button
          @click="${() => this.simpleSignal$.setValue(value => value + 1)}"
        >
          increment
        </button>
      </section>
      <section>
        ObjectSignalValue:
        <pre>${JSON.stringify(this.objectSignalValue, null, 2)}</pre>

        <button
          @click="${() =>
            this.objectSignal$.setValue(value => {
              value.books[1].price.amount++;
            })}"
        >
          increase price of second book
        </button>
      </section> `;
  }

  static get styles() {
    return css`
      :host {
        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }

      section {
        padding-bottom: 32px;
      }
    `;
  }
}
