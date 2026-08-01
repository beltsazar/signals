import { cloneDeep, isEqual } from "lodash-es";
import { freezeDeep } from "../utils/freezeDeep.js";

/**
 * Signal class that holds a value and notifies watchers when the value changes.
 * It supports both direct value assignment and callback-based updates.
 */
export class Signal {
  /**
   * @param {*} initialValue - The initial value to be deeply cloned and frozen.
   * @return {Object} A new instance of the class.
   */
  constructor(initialValue) {
    this._previousValue = undefined;
    this._value = freezeDeep(cloneDeep(initialValue));
    this._watchers = new Set();
  }

  get value() {
    return this._value;
  }

  get previousValue() {
    return this._previousValue;
  }

  addWatcher(watcher) {
    this._watchers.add(watcher);
  }

  removeWatcher(watcher) {
    this._watchers.delete(watcher);
  }

  /**
   * Set or mutate the observable value of the Signal. The function accepts a primitive value or a (nested) object, or a callback mutating a copy of the current value passed to the callback.
   * Examples:
   * setValue('value')
   * setValue({ property: 'value' })
   * setValue(value => {
   *   value.property = 'newValue'; // mutate an existing property inside an object
   * })
   * setValue(value => ({...value, property: 'newValue'}) // same effect as above
   * @param valueOrCallback
   */
  setValue(valueOrCallback) {
    const currentValue = this.value;
    let newValue;

    if (valueOrCallback && typeof valueOrCallback === "function") {
      // create a mutable copy of the new data object
      newValue = cloneDeep(currentValue);
      // let consumer callback mutate this copy or return a new value
      const returnValue = valueOrCallback(newValue);
      if (returnValue) {
        newValue = returnValue;
      }
    } else {
      newValue = valueOrCallback;
    }

    // notify only when the next value differs from the current value
    if (!isEqual(newValue, currentValue)) {
      // the current value becomes the previous value before we update the current value
      this._previousValue = currentValue;
      // clone the consumer value to prevent nested consumer objects to be frozen :(=)
      this._value = freezeDeep(cloneDeep(newValue));
      // notify watchers
      this._watchers.forEach(watcher => watcher.notify(this));
    }
  }
}
