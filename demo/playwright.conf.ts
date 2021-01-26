import {BrowserContextOptions, LaunchOptions} from 'playwright';
import {Browsers, Playwright} from '../playwright/controller';

export const BASE_URL = 'http://localhost:4200/#';

const launchOptions: LaunchOptions = {headless: !!process.env.TRAVIS};
const contextOptions: BrowserContextOptions = {
  viewport: {width: 1280, height: 720}
};

export const test = new Playwright(Browsers.chromium, launchOptions, contextOptions);
