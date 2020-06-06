import React from "react";

import moment from "moment";
import TimeTracker from "./components/TimeTracker";
import Container from '@material-ui/core/Container';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

class App extends React.Component {
  slotDuration = moment.duration(30, "m");
  hasChanged = false;

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const theme = createMuiTheme({
        palette: {
            type: 'dark',
            primary: {
                // light: will be calculated from palette.primary.main,
                main: '#2185d0',
                // dark: will be calculated from palette.primary.main,
                // contrastText: will be calculated to contrast with palette.primary.main
            },
            
        },
        
    });
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <AppBar color="transparent" position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6">
              Time Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <TimeTracker date={this.state.date} db={this.props.db} />
        </Container>
        </Box>
      </ThemeProvider>
    );
  }
}



export default App;
