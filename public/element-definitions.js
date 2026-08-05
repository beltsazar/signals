import { FeatureMainComponent } from "../packages/examples/feature/src/feature-main-component.js";
import { MixinComponent } from "../packages/examples/mixins/mixin-component.js";
import { MainComponent } from "../packages/examples/mixins/context/main-component.js";
import { PageContainer } from "../packages/examples/composition/page-component/page-container.js";
import { PageComponent } from "../packages/examples/composition/page-component/page-component.js";
import { NextPageButton } from "../packages/examples/composition/page-component/next-page-button.js";
import { CustomPageComponent } from "../packages/examples/composition/custom-page-component.js";
import { CustomPageComponentAsync } from "../packages/examples/composition/custom-page-component-async.js";
import { PageDemo } from "../packages/examples/composition/page-demo.js";

window.customElements.define("feature-component", FeatureMainComponent);
window.customElements.define("mixin-component", MixinComponent);
window.customElements.define("mixin-inheritance-component", MainComponent);
window.customElements.define("page-container", PageContainer);
window.customElements.define("page-component", PageComponent);
window.customElements.define("next-page-button", NextPageButton);
window.customElements.define("custom-page-component", CustomPageComponent);
window.customElements.define("custom-page-component-async", CustomPageComponentAsync);
window.customElements.define("page-demo", PageDemo);