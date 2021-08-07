import { EHRSessionConstant } from 'app/modules/ehr/sessionStorage/ehrStorageConstant';

export const EHRSessionStorage = class {
  public static set(key: string, value: string) {
    const keys = Object.keys(EHRSessionConstant);
    if (keys.indexOf(key) !== -1) {
      sessionStorage.setItem(key, value);
    }
  }

  public static get(key: string): string {
    const keys = Object.keys(EHRSessionConstant);
    if (keys.indexOf(key) !== -1) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  public static delete(key: string) {
    const keys = Object.keys(EHRSessionConstant);
    if (keys.indexOf(key) !== -1) {
      sessionStorage.removeItem(key);
    }
  }

  public static deleteAll() {
    const keys = Object.keys(EHRSessionConstant);
    for (const key of keys) {
      sessionStorage.removeItem(key);
    }
  }
};
