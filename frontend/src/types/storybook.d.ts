declare module '@storybook/react' {
  export * from '@storybook/react/types-6-0';
}

declare module '@storybook/addon-actions' {
  export * from '@storybook/addon-actions/types-6-0';
}

declare module '@storybook/addon-essentials' {
  export * from '@storybook/addon-essentials/types-6-0';
}

declare module 'storybook/test' {
  export const fn: () => void;
  export const userEvent: any;
  export const within: any;
  export const expect: any;
}
