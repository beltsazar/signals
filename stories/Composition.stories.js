import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Examples/Composition",
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const PageFlow = {
  render: () => {
    const state = {
      user: "John Doe",
      age: 27,
    };

    return html`
      <flow-pages heading="Page Flow" .state=${state}>
        <flow-next-page-button label="Next Page"></flow-next-page-button>
        <flow-page heading="Page 1">Content ...</flow-page>
        <flow-page heading="Page 2"
          >Content ...<flow-page heading="Page 3 nested inside page 2"
            >Content...<flow-page heading="Page 4 nested inside page 3"
              >Content...<custom-flow-component heading="Custom page"
                ><flow-next-page-button
                  label="Next Page"
                ></flow-next-page-button></custom-flow-component></flow-page></flow-page
        ></flow-page>
        <flow-page heading="Page 5"
          >Content ...
          <custom-flow-component-async heading="Custom page with async content"
            ><flow-next-page-button label="Next Page"></flow-next-page-button
          ></custom-flow-component-async>
        </flow-page>
        <flow-page heading="Page 6">Content ...</flow-page>
      </flow-pages>
    `;
  },
};

export const AdvancedPageFlow = {
  render: () => {
    return html`<flow-demo></flow-demo>`;
  },
};
