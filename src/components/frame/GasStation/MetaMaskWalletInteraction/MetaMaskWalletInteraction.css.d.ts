declare namespace MetaMaskWalletInteractionCssNamespace {
  export interface IMetaMaskWalletInteractionCss {
    content: string;
    main: string;
    text: string;
  }
}

declare const MetaMaskWalletInteractionCssModule: MetaMaskWalletInteractionCssNamespace.IMetaMaskWalletInteractionCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MetaMaskWalletInteractionCssNamespace.IMetaMaskWalletInteractionCss;
};

export = MetaMaskWalletInteractionCssModule;
