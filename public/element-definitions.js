import { FeatureMainComponent } from "../packages/examples/feature/src/feature-main-component.js";
import { MixinComponent } from "../packages/examples/mixins/mixin-component.js";
import { MainComponent } from "../packages/examples/mixins/context/main-component.js";
import { FlowPages } from "../packages/examples/composition/flow/flow-pages.js";
import { FlowPage } from "../packages/examples/composition/flow/flow-page.js";
import { FlowNextPageButton } from "../packages/examples/composition/flow/flow-next-page-button.js";
import { CustomFlowPage } from "../packages/examples/composition/custom-flow-page.js";
import { CustomFlowPageAsync } from "../packages/examples/composition/custom-flow-page-async.js";
import { FlowDemo } from "../packages/examples/composition/flow-demo.js";

window.customElements.define("feature-component", FeatureMainComponent);
window.customElements.define("mixin-component", MixinComponent);
window.customElements.define("mixin-inheritance-component", MainComponent);
window.customElements.define("flow-pages", FlowPages);
window.customElements.define("flow-page", FlowPage);
window.customElements.define("flow-next-page-button", FlowNextPageButton);
window.customElements.define("custom-flow-page", CustomFlowPage);
window.customElements.define("custom-flow-page-async", CustomFlowPageAsync);
window.customElements.define("flow-demo", FlowDemo);