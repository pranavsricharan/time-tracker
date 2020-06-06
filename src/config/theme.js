import { createMuiTheme } from "@material-ui/core";

const DEFAULT_THEME = createMuiTheme({
  palette: {
      type: 'dark',
      primary: {
          main: '#2185d0',
      },
      
  }
});

export { DEFAULT_THEME }