import React from "react";
import Container from '@material-ui/core/Container';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Switch, createMuiTheme } from "@material-ui/core";
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import { ThemeProvider } from '@material-ui/styles';

import TimeTrackerPage from "./components/TimeTrackerPage";
import Constants from './config/constants';
import localDataService from './service/LocalDataService';

type AppState = {
  themeName: string
}

class App extends React.Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      themeName: localDataService.getThemeName(),
    }

    this.changeTheme = this.changeTheme.bind(this);
  }

  changeTheme(e: React.ChangeEvent, checked: boolean) {
    const selectedTheme = (checked)
      ? Constants.THEME.DEFAULT
      : Constants.THEME.LIGHT;
    localDataService.setTheme(selectedTheme);
    
    this.setState({
      themeName: selectedTheme
    });
  }

  render() {
    const theme = createMuiTheme(localDataService.getTheme());
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline key={this.state.themeName} />
      <Box style={{ paddingBottom: '2em' }}>
        <AppBar color="transparent" position="static" elevation={0}>
          <Toolbar>
            <Typography style={{ flexGrow: 1 }} variant="h6">
              { Constants.APP_TITLE }
            </Typography>
            <Box style={{ display: 'flex', alignItems: 'center' }}>  
              <Brightness7Icon />
              <Switch
                checked={this.state.themeName === Constants.THEME.DEFAULT}
                color="primary"
                onChange={this.changeTheme}
                value="darkTheme"
              />
              <Brightness3Icon /> 
            </Box>
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
