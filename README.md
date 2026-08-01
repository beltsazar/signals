# Signals

This library provides a simple but effective implementation of the **Signals** concept. It allows you to apply reactive state management in a UI system. The **Mixins** provide extra integration and convenience for usage with **LitElement**: 

* **Signal** object with immutable value (state) that can be observed
* **ComputedSignal** object that can compute read-only values from one ore multiple Signals
* **Watcher** object that can observe value changes from one or multiple Signals or ComputedSignals

For [LitElement](https://lit.dev/) webcomponents:

* **SignalsMixin** for LitElement for integration Signals into the rendering system
* **SignalsProviderMixin** extends SignalsMixin and adds sharing Signals from a LitElement to its children using [@lit/context](https://lit.dev/docs/data/context/)
* **SignalsConsumerMixin** extends SignalsMixin and adds consuming Signals shared by a LitElement parent using [@lit/context](https://lit.dev/docs/data/context/)

## Examples

Install npm package:
```console
npm i @beltsazar/signals
```

Basic usage:
```js
import { Signal, ComputedSignal, Watcher } from '@beltsazar/signals';

const counter$ = new Signal(1);
const watcher = new Watcher(counter$, () => {
    console.log(counter$.value) // watcher logs: 1
})

signal$.setValue(2);
// watcher logs: 2

const animals$ = new Signal('dogs');
const computed$ = new ComputedSignal([counter$, animals$], () => {
  return `${counter$.value} ${animals$.value}`
})

// nothing happens until you starts to watch:
const watcher2 = new Watcher(computed$, () => {
  console.log(computed$.value) // watcher2 logs: '2 dogs'
})

// the computed signal updates when one of its dependent signals change
animals$.setValue('cats'); // watcher2 logs: '2 cats'
counter$.setValue(3); // watcher2 logs: '3 cats'

// after usage you should so cleanup on ComputedSignals and Watchers
computed$.dispose();
watcher.dispose();
watcher2.dispose();
```

This is just the beginning: Look at more advanced examples with the Mixins at [Github](https://github.com/beltsazar/signals/tree/main/packages/examples) or checkout the repo locally and run the storybooks:
```console
npm run storybook 
```

Have fun!