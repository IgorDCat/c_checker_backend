import { Page } from 'playwright';

export async function goToNextMonth(
    page: Page
): Promise<void> {
    const nextButton = page.locator(
        'i.fa-angle-right'
    );

    await nextButton.click();

    await page.waitForTimeout(1500);
}

export async function goToPreviousMonth(
    page: Page
): Promise<void> {
    const prevButton = page.locator(
        'i.fa-angle-left'
    );

    await prevButton.click();

    await page.waitForTimeout(1500);
}