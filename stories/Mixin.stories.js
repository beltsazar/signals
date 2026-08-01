import { html } from "lit";

export default {
  title: "Examples/Mixins",
};

export const BasicUsageSignalsMixin = {
  render: () => html` <mixin-component></mixin-component> `,
};

export const UsingContextProviderAndConsumer = {
  render: () => html`
    <mixin-inheritance-component></mixin-inheritance-component>
  `,
};
