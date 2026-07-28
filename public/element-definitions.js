import { FeatureMainComponent } from "../packages/examples/feature/src/feature-main-component.js";
import { MainComponent } from "../packages/examples/mixins/main-component.js";
import { PageContainer } from "../packages/examples/composition/page-container.js";
import { PageComponent } from "../packages/examples/composition/page-component.js";
import { CustomPageComponent } from "../packages/examples/composition/custom-page-component.js";
import { CustomPageComponentAsync } from "../packages/examples/composition/custom-page-component-async.js";

window.customElements.define("feature-component", FeatureMainComponent);
window.customElements.define("mixin-component", MainComponent);
window.customElements.define("page-container", PageContainer);
window.customElements.define("page-component", PageComponent);
window.customElements.define("custom-page-component", CustomPageComponent);
window.customElements.define("custom-page-component-async", CustomPageComponentAsync);