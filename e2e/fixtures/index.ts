import { test as base, chromium, type BrowserContext, type Page } from "@playwright/test";
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
import { prepareMetamask } from "@synthetixio/synpress/helpers";
import waitForExpect from "wait-for-expect";

import path from "path";

import { METAMASK_PASSWORD, METAMASK_SEED_PHRASE, NETWORK } from "../constants";

export interface TestExtension {
  context: BrowserContext;
  cryptKeeperExtensionId: string;
  app: Page;
  cryptKeeper: Page;
}

export const test = base.extend<TestExtension>({
  context: [
    async ({}, use) => {
      const metamaskPath = await prepareMetamask(process.env.METAMASK_VERSION || "10.28.1");
      const cryptKeeperPath = path.join(__dirname, "../../dist");

      const context = await chromium.launchPersistentContext("", {
        headless: false,
        args: [
          process.env.HEADLESS ? `--headless=new` : "",
          process.env.CI ? "--disable-gpu" : "",
          `--disable-extensions-except=${cryptKeeperPath},${metamaskPath}`,
          `--load-extension=${cryptKeeperPath},${metamaskPath}`,
          "--disable-dev-shm-usage",
          "--no-sandbox",
          "--remote-debugging-port=9222",
        ].filter(Boolean),
      });

      await waitForExpect(() => {
        test.expect(context.backgroundPages()).toHaveLength(1);
      });
      const [metamaskBackground] = context.backgroundPages();
      await metamaskBackground.waitForTimeout(2000);
      // eslint-disable-next-line no-console
      console.log("Metamask url", metamaskBackground.url());

      await initialSetup(chromium, {
        secretWordsOrPrivateKey: METAMASK_SEED_PHRASE,
        network: NETWORK,
        password: METAMASK_PASSWORD,
        enableAdvancedSettings: true,
      });

      await use(context);
      await context.close();
    },
    { scope: "test" },
  ],

  app: [
    async ({ context }, use) => {
      const [page] = context.pages();
      await page.goto("/");
      await page.bringToFront();

      await use(page);
      await context.close();
    },
    { scope: "test" },
  ],

  cryptKeeper: [
    async ({ context }, use) => {
      await Promise.all(
        context.serviceWorkers().map((sw) => {
          if (!sw) {
            return context.waitForEvent("serviceworker");
          }

          return undefined;
        }),
      );

      context.on("page", async (page: Page) => {
        await page.waitForLoadState();

        const title = await page.title();

        if (title.toLowerCase() === "crypt keeper") {
          await use(page);
        }
      });
    },
    { scope: "test" },
  ],

  cryptKeeperExtensionId: [
    async ({ context }, use) => {
      let [background] = context.serviceWorkers();
      if (!background) {
        background = await context.waitForEvent("serviceworker");
      }

      const extensionId = background.url().split("/")[2];
      await use(extensionId);
    },
    { scope: "test" },
  ],
});

export const { expect } = test;