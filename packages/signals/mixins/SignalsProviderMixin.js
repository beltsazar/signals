import { dedupeMixin } from "@open-wc/dedupe-mixin";
import { ContextProvider } from "@lit/context";
import { context } from "./signals-context.js";
import { SignalsMixin } from "./SignalsMixin.js";

export const SignalsProviderMixin = dedupeMixin(
  superClass =>
    class extends SignalsMixin(superClass) {
      #contextProvider = new ContextProvider(this, { context });
      #sharedSignals = {};

      setSignals(signals) {
        this.#sharedSignals = signals;
        this.#contextProvider.setValue(signals);
        return signals;
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        // dispose provided shared signals when the element is disconnected
        Object.values(this.#sharedSignals).forEach(signal => {
          signal.dispose?.();
        });
      }
    },
);
