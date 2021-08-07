export interface IAppInfo {
  name: string;
  urls: string[];
  routes: string | string[];
  events?: any;
}

export interface IMicroApps {
  appAccountManager: IAppInfo;
}

export const alwaysRender = 'alwaysRender';

const MicroApps: IMicroApps = {
  appAccountManager: {
    name: 'appAccountManager',
    urls: ['http://localhost:9003/static/js/bundle.js'],
    routes: ['/tai-khoan']
  }
};

export default MicroApps;
