/* eslint-disable class-methods-use-this */
import { dedupeMixin } from "@open-wc/dedupe-mixin";
import { Signal } from "../core/Signal.js";
import { ComputedSignal } from "../core/ComputedSignal.js";
import { Watcher } from "../core/Watcher.js";

export const SignalsMixin = dedupeMixin(
  superClass =>
    class extends superClass {
      #computedSignals = [];
      #watchers = [];

      /**
       * Watch signals for changes and execute a callback when they change.
       * @param signals
       * @param callback
       * @returns {Watcher}
       */
      watch(signals, callback) {
        const watcher = new Watcher(signals, callback);
        this.#watchers.push(watcher);
        return watcher;
      }

      /**
       * Create a new signal with an initial value.
       * @param initialValue
       * @returns {Signal}
       */
      signal(initialValue) {
        return new Signal(initialValue);
      }

      /**
       * Create a new computed signal based on the provided signals and callback.
       * @param signals
       * @param callback
       * @returns {ComputedSignal}
       */
      computed(signals, callback) {
        const computedSignal = new ComputedSignal(signals, callback);
        this.#computedSignals.push(computedSignal);
        return computedSignal;
      }

      /**
       * Map the values of signals to properties of the component.
       * @param map
       */
      mapStateToSignals(map) {
        for (const [property, signal] of Object.entries(map)) {
          this.#watchers.push(
            new Watcher(signal, () => {
              this[property] = signal.value;
            }),
          );
        }
      }

      /**
       * Dispose of all watchers and computed signals.
       */
      dispose() {
        this.#watchers.forEach(watcher => watcher.dispose());
        this.#computedSignals.forEach(computedSignal =>
          computedSignal.dispose(),
        );
        this.#watchers = [];
        this.#computedSignals = [];
      }
    },
);
