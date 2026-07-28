import { html } from "lit";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Examples/Composition",
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  render: () => {
    const state = {
      user: "John Doe",
      age: 27,
    };

    return html`
      <page-container heading="Page Container" .initialState=${state}>
        <next-page-button label="Next Page"></next-page-button>
        <page-component heading="Page Component 1">Content ...</page-component>
        <page-component heading="Page Component 2"
          >Content ...<page-component heading="Page Component 3 nested inside 2"
            >Content...<page-component
              heading="Page Component 4 nested inside 3"
              >Content...<custom-page-component heading="Custom page component"
                ><next-page-button
                  label="Next Page"
                ></next-page-button></custom-page-component></page-component></page-component
        ></page-component>
        <page-component heading="Page Component 3"
          >Content ...
          <custom-page-component-async
            heading="Custom page component with async content"
            ><next-page-button label="Next Page"></next-page-button
          ></custom-page-component-async>
        </page-component>
        <page-component heading="Page Component 4">Content ...</page-component>
      </page-container>
    `;
  },
};
