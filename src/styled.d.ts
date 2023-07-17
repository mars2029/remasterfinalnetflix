import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
    mobile: `(max-width: ${size.mobile})`;
    tablet: `(max-width: ${size.tablet})`;
    laptop: `(max-width: ${size.laptop})`;
    desktop: `(min-width: ${size.desktop})`;
  }
}
