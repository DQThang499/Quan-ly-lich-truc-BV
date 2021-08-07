export const loadScript = (url: string) =>
  new Promise((resolve, reject) => {
    const scriptEl = document.createElement('script');
    scriptEl.src = url;
    scriptEl.addEventListener('error', errEvt => {
      reject(errEvt.error);
    });
    scriptEl.addEventListener('load', () => {
      resolve();
    });

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(scriptEl, firstScript);
  });

// Dùng hashRouter
export const matchingHashRouter = routes => routes.some(route => window.location.hash === `#${route}`);

export const mainApp = 'MAIN_APP';
const _key = (appName: string, event: string) => `${appName}/${event}`;

export const dispatchMicroAppEvent = async (event: any, agrs: any) => {
  await sessionStorage.setItem(_key(mainApp, event), JSON.stringify(agrs));
  await window.dispatchEvent(new Event(_key(mainApp, event)));
};

export const addMicroAppsEventListener = (appName: string, event: string, handleEvent: any) => {
  window.addEventListener(_key(appName, event), handleEvent);
};

export const removeMicroAppsEventListener = (appName: string, event: string, handleEvent: any) => {
  window.removeEventListener(_key(appName, event), handleEvent);
};

export const getAgrsOfMicroAppsEvent: any = (appName: string, event: string) => {
  const str = sessionStorage.getItem(_key(appName, event));
  if (str !== null) {
    const tmp = JSON.parse(str);
    sessionStorage.removeItem(_key(appName, event));
    return tmp;
  } else return null;
};
