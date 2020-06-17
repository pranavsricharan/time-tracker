// Snippet from MDN
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const localStorageAvailable = () => {
  let storage: Storage | null = null;
  try {
      storage = window['localStorage'];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

class LocalStore {
  constructor() {
    if (localStorageAvailable()) {
      this.setValue = this._setToLocalStorage;
      this.getValue = this._getFromLocalStorage;
    } else {
      this.setValue = this._setCookie;
      this.getValue = this._getCookie;
    }
  }

  setValue(key: string, value: any) {};
  getValue(key: string, defaultValue: any): any { return '' };
  
  _setCookie(key: string, value: any) {
    const jsonValue = JSON.stringify(value);
    const cookieString = `${key}=${encodeURIComponent(jsonValue)}`
    document.cookie = cookieString;
  }

  _setToLocalStorage(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }

  _getCookie(key: string, defaultValue: any): any {
    const cookieEntry = document.cookie
      .split('; ')
      .find(entry => entry.startsWith(`${key}=`));
    
      if (!!cookieEntry) {
        const cookieValue = cookieEntry.split('=')[1]
        return JSON.parse(decodeURIComponent(cookieValue));
      }

      return defaultValue || null;
  }

  _getFromLocalStorage(key: string, defaultValue: any): any {
    const value = window.localStorage.getItem(key);

    return value || defaultValue || null;
  }
}

export default (new LocalStore());