import { Browser, chromium } from 'playwright';

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
    if (browser) {
        return browser;
    }

    browser = await chromium.launch({
        headless: true,
    });

    console.log('Chromium launched');

    return browser;
}

export async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();

        browser = null;

        console.log('Chromium closed');
    }
}
