import { chromium, Page } from 'playwright';

import { checkerState } from '../state/checkerState';

import { sendTelegramMessage } from './telegram';

const URL = process.env.CHECKED_URL || '';

async function getAvailableDays(
    page: Page
): Promise<string[]> {
    return await page
        .locator('.dia-habil')
        .allTextContents();
}

async function goToNextMonth(
    page: Page
): Promise<void> {
    const nextButton = page.locator(
        'i.fa-angle-right'
    );

    await nextButton.click();

    await page.waitForTimeout(1500);
}

async function goToPreviousMonth(
    page: Page
): Promise<void> {
    const prevButton = page.locator(
        'i.fa-angle-left'
    );

    await prevButton.click();

    await page.waitForTimeout(1500);
}

export async function checkAppointments() {
    let browser;

    try {
        browser = await chromium.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.goto(URL, {
            waitUntil: 'networkidle',
            timeout: 120000,
        });

        await page.waitForTimeout(5000);

        const officeSelect =
            page.locator('select').first();

        const serviceSelect =
            page.locator('select').nth(1);

        await officeSelect.selectOption({
            label:
                'SAIC - Servicio Atención Integral Ciudadana',
        });

        await page.waitForTimeout(1000);

        await serviceSelect.selectOption({
            label:
                '(C/PINO SANTO 1) MAÑANA - TRÁMITES MUNICIPALES',
        });

        await page.waitForTimeout(3000);

        // ===== ТЕКУЩИЙ МЕСЯЦ =====

        const currentMonthDays =
            await getAvailableDays(page);

        console.log(
            'Current month:',
            currentMonthDays
        );

        let nextMonthDays: string[] = [];

        // ===== СЛОТОВ НЕТ → ПРОВЕРЯЕМ СЛЕДУЮЩИЙ =====

        if (currentMonthDays.length === 0) {
            console.log(
                'No slots in current month, checking next month...'
            );

            await goToNextMonth(page);

            nextMonthDays =
                await getAvailableDays(page);

            console.log(
                'Next month:',
                nextMonthDays
            );

            // optional
            await goToPreviousMonth(page);
        }

        const allSlots = [
            ...currentMonthDays,
            ...nextMonthDays,
        ];

        // ===== УВЕДОМЛЕНИЕ =====

        if (
            allSlots.length > 0 &&
            JSON.stringify(allSlots) !==
            JSON.stringify(
                checkerState.lastSlots
            )
        ) {
            await sendTelegramMessage(
                `🚨 Свободные слоты:\n${allSlots.join(
                    ', '
                )}`
            );

            console.log('Notification sent');
        }

        checkerState.lastSlots = allSlots;

        return {
            success: true,
            slots: allSlots,
        };
    } catch (err) {
        console.error(err);

        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : 'Unknown error',
        };
    } finally {
        await browser?.close();
    }
}