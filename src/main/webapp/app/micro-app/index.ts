import MicroApps, { alwaysRender } from './apps-info';
import * as singleSpa from 'single-spa';
import { loadScript, matchingHashRouter } from 'app/micro-app/utils';

export const registerAllMicroApp = () => {
  for (const app of Object.values(MicroApps)) {
    const appName: string = app.name;
    singleSpa.registerApplication(
      appName,
      async () => {
        for (const url of app.urls) {
          await loadScript(url);
        }
        return window[appName];
      },
      (location: Location) => app.routes === alwaysRender || matchingHashRouter(app.routes)
    );
  }
};
