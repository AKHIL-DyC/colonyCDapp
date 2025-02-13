declare namespace NavBarCssNamespace {
  export interface INavBarCss {
    alertBanner: string;
    content: string;
    history: string;
    main: string;
    navHeight: string;
    navigation: string;
    user: string;
    wrapper: string;
  }
}

declare const NavBarCssModule: NavBarCssNamespace.INavBarCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: NavBarCssNamespace.INavBarCss;
};

export = NavBarCssModule;
