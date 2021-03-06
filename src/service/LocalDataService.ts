import localStore from '../persistence/localstore';
import Constants from '../config/constants';
import { DEFAULT_THEME, LIGHT_THEME } from '../config/theme';
import { ThemeOptions } from '@material-ui/core';

class LocalDataService {
  getThemeName(): string {
    return localStore.getValue('theme', Constants.THEME.DEFAULT);
  }
  getTheme(): ThemeOptions {
    const userTheme: string = localStore.getValue('theme', Constants.THEME.DEFAULT);

    return (userTheme === Constants.THEME.LIGHT)
    ? LIGHT_THEME
    : DEFAULT_THEME;
  }

  setTheme(theme: string) {
    localStore.setValue('theme', theme);
  }
}

export default new LocalDataService();