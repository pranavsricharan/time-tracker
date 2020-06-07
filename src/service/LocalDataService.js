import localStore from '../persistence/localstore';
import Constants from '../config/constants';
import { DEFAULT_THEME, LIGHT_THEME } from '../config/theme';

class LocalDataService {
  getThemeName() {
    return localStore.getValue('theme', Constants.THEME.DEFAULT);
  }
  getTheme() {
    const userTheme = localStore.getValue('theme', Constants.THEME.DEFAULT);

    return (userTheme === Constants.THEME.LIGHT)
    ? LIGHT_THEME
    : DEFAULT_THEME;
  }

  setTheme(theme) {
    localStore.setValue('theme', theme);
  }
}

export default new LocalDataService();