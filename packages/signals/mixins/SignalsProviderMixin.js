import { ContextProvider } from "@lit/context";
import { context } from "./signals-context.js";
import { SignalsBaseMixin } from "./SignalsBaseMixin.js";

export const SignalsProviderMixin = superClass =>
  class extends SignalsBaseMixin(superClass) {
    #contextProvider = new ContextProvider(this, { context });
    #sharedSignals = {};

    set signals(signals) {
      this.#sharedSignals = signals;
      this.#contextProvider.setValue(signals);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // dispose provided shared signals when the element is disconnected
      Object.values(this.#sharedSignals).forEach(signal => {
        signal.dispose?.();
      });
    }
  };
