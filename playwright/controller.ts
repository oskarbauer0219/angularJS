import {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  BrowserType,
  chromium,
  firefox,
  LaunchOptions,
  Page,
  webkit
} from 'playwright';


export const Browsers = {chromium, firefox, webkit};

export class Playwright {
  page: Page;
  private _context: BrowserContext;

  constructor(
      private _browser: BrowserType<Browser>, private _launchOptions: LaunchOptions,
      private _contextOptions: BrowserContextOptions) {}

  private async _launchBrowser() {
    if (!this._context) {
      const browserInstance = await this._browser.launch(this._launchOptions);
      this._context = await browserInstance.newContext(this._contextOptions);

      // Default timeout used to wait for selector/actions requiring timeout
      this._context.setDefaultTimeout(process.env.CI ? 60000 : 2000);
    }
  }

  async newPage(url?: string): Promise<Page> {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }

    if (!this._context) {
      await this._launchBrowser();
    }
    this.page = await this._context.newPage();

    const videoPath = await this.page.video() ?.path();

    if (videoPath) {
      console.log(`A video of the test is recorded in ${videoPath}`);
    } else {
      console.log('No video of the test is recorded.');
    }

    if (url) {
      await this.page.goto(url);
    }

    return this.page;
  }

  /**
   *
   * @param seconds number of seconds to wait (default: 1000s)
   */
  async pause(seconds = 1000, msg?: string) {
    console.log(`Warning : paused for ${seconds}s` + (msg ? ` (${msg})` : ''));
    await this.page.waitForTimeout(seconds * 1000);
  }

  async destroy() {
    const context = this._context;
    if (context) {
      await context.close();
    }
  }
}
