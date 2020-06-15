import { ThemeOptions } from "@material-ui/core";

const COLOR_PRIMARY = '#2185d0';

const DEFAULT_THEME: ThemeOptions = {
  palette: {
      type: 'dark',
      primary: {
          main: COLOR_PRIMARY,
      },
      
  }
};

const LIGHT_THEME: ThemeOptions = {
  palette: {
      primary: {
          main: COLOR_PRIMARY,
      },
      
  }
};

export { DEFAULT_THEME, LIGHT_THEME }