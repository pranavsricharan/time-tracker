import React from "react";
import Container from '@material-ui/core/Container';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';

import TimeTrackerPage from "./components/TimeTrackerPage";
import Constants from './config/constants';
import { DEFAULT_THEME } from './config/theme';

class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={DEFAULT_THEME}>
      <CssBaseline />
      <Box style={{ paddingBottom: '2em' }}>
        <AppBar color="transparent" position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6">
              { Constants.APP_TITLE }
            </Typography>
          </Toolbar>
        </AppBar>
        <Container style={{ marginTop: '1em' }}>
          <TimeTrackerPage />
        </Container>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
