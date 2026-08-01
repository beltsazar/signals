import { ContextConsumer } from "@lit/context";
import { context } from "./signals-context.js";
import { SignalsMixin } from "./SignalsMixin.js";

export const SignalsConsumerMixin = superClass =>
  class extends SignalsMixin(superClass) {
    #contextConsumer = new ContextConsumer(this, { context });

    getSignals() {
      return this.#contextConsumer.value;
    }
  };
