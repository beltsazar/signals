import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Examples/Composition",
};

export const AdvancedPageFlow = {
  render: () => {
    return html`<flow-demo></flow-demo>`;
  },
};
