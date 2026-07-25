import { FeatureMainComponent } from "../packages/examples/feature/src/feature-main-component.js";
import { MainComponent } from "../packages/examples/mixins/main-component.js";

window.customElements.define("feature-component", FeatureMainComponent);
window.customElements.define("mixin-component", MainComponent);