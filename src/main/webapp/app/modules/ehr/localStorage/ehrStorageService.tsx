import { EHRLocalConstant } from 'app/modules/ehr/localStorage/ehrStorageConstant';

export const EHRLocalStorage = class {
  public static set(key: string, value: string) {
    const keys = Object.keys(EHRLocalConstant);
    if (keys.indexOf(key) !== -1) {
      localStorage.setItem(key, value);
    }
  }

  public static get(key: string): string {
    const keys = Object.keys(EHRLocalConstant);
    if (keys.indexOf(key) !== -1) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public static delete(key: string) {
    const keys = Object.keys(EHRLocalConstant);
    if (keys.indexOf(key) !== -1) {
      localStorage.removeItem(key);
    }
  }

  public static deleteAll() {
    const keys = Object.keys(EHRLocalConstant);
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  }
};
