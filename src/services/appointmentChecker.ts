import {BrowserContext, Page} from 'playwright';

import { checkerState } from '../state/checkerState';

import { sendTelegramMessage } from './telegram';
import {goToNextMonth, goToPreviousMonth} from "./goToNextMonth";
import {SERVICES} from "./services";
import {getBrowser} from "./browser";
import {getCurrentDateTime} from "../helpers/getCurrentDateTime";

const CHECK_INTERVAL =
    Number(process.env.CHECK_INTERVAL) || 1012200;

const URL = process.env.CHECKED_URL || '';

async function getAvailableDays(
    page: Page
): Promise<string[]> {
    return await page
        .locator('.dia-habil')
        .allTextContents();
}


async function performCheck(): Promise<void> {
    if (checkerState.isChecking) {
        console.log('Check already running');

        return;
    }

    checkerState.isChecking = true;

    checkerState.lastCheckingTime = getCurrentDateTime()
    console.log('lastCheckingTime: ' + checkerState.lastCheckingTime)

    let context: BrowserContext | null = null;

    try {
        if (!URL) {
            checkerState.lastError = 'no url'
            checkerState.lastErrorTime = getCurrentDateTime()
        }

        console.log(
            `[${new Date().toISOString()}] Checking appointments...`
        );

        const browser = await getBrowser()

        context = await browser.newContext()

        const page = await context.newPage()

        await page.goto(URL, {
            waitUntil: 'networkidle',
            timeout: 120000,
        });

        await page.waitForTimeout(5000);

        const officeSelect =
            page.locator('select').first();

        const serviceSelect =
            page.locator('select').nth(1);

        // основной офис
        await officeSelect.selectOption({
            label:
                'SAIC - Servicio Atención Integral Ciudadana',
        });

        await page.waitForTimeout(1000);

        const foundSlots: string[] = [];

        // ===== CHECK ALL SERVICES =====

        for (const service of SERVICES) {
            console.log(`Checking service: ${service}`);

            if (!checkerState.isRunning) break

            try {
                await serviceSelect.selectOption({
                    label: service,
                });

                await page.waitForTimeout(3000);

                // ===== CURRENT MONTH =====

                const currentMonthDays =
                    await getAvailableDays(page);

                console.log(
                    `${service} current month:`,
                    currentMonthDays
                );

                let nextMonthDays: string[] = [];

                // ===== NEXT MONTH =====

                if (currentMonthDays.length === 0) {
                    console.log(`No slots in current month for ${service}. Checking next month...`);

                    await goToNextMonth(page)
                    await page.waitForTimeout(1000);

                    nextMonthDays =
                        await getAvailableDays(page);

                    console.log(
                        `${service} next month:`,
                        nextMonthDays
                    );

                    // вернуть календарь обратно
                    await goToPreviousMonth(page);
                }

                const serviceSlots = [
                    ...currentMonthDays,
                    ...nextMonthDays,
                ];

                if (serviceSlots.length > 0) {
                    foundSlots.push(
                        `${service}: ${serviceSlots.join(
                            ', '
                        )}`
                    );
                }
            } catch (err) {
                checkerState.lastError = String(err)
                checkerState.lastErrorTime = getCurrentDateTime()
                console.error(
                    `Failed checking service ${service}:`,
                    err
                );
            }
        }

        console.log('Found slots:', foundSlots);

        const hasNewSlots =
            foundSlots.length > 0 &&
            JSON.stringify(foundSlots) !==
            JSON.stringify(
                checkerState.lastSlots
            );

        if (hasNewSlots) {
            await sendTelegramMessage(
                `🚨 Найдены свободные слоты:\n\n${foundSlots.join(
                    '\n\n'
                )}`
            );
        }

        checkerState.lastSlots = foundSlots;
    } catch (err) {
        console.error('Check failed:', err);
        checkerState.lastError = String(err)
        checkerState.lastErrorTime = getCurrentDateTime()
    } finally {
        checkerState.isChecking = false;

        await context?.close();
    }
}

export function startChecker() {
    if (checkerState.isRunning) {
        return {
            success: false,
            message: 'Checker already running',
        };
    }

    checkerState.isRunning = true;

    // первая проверка сразу
    void performCheck();

    checkerState.intervalId = setInterval(() => {
        void performCheck();
    }, CHECK_INTERVAL);

    console.log('Checker started');

    return {
        success: true,
        message: 'Checker started',
    };
}

export function stopChecker() {
    if (!checkerState.isRunning) {
        return {
            success: false,
            message: 'Checker is not running',
        };
    }

    if (checkerState.intervalId) {
        clearInterval(checkerState.intervalId);
    }

    checkerState.intervalId = null;

    checkerState.isRunning = false;

    console.log('Checker stopped');

    return {
        success: true,
        message: 'Checker stopped',
    };
}

export function getCheckerStatus() {
    return {
        isRunning: checkerState.isRunning,
        isChecking: checkerState.isChecking,
        lastSlots: checkerState.lastSlots,
        lastCheckingTime: checkerState.lastCheckingTime,
        lastError: checkerState.lastError,
        lastErrorTime: checkerState.lastErrorTime
    };
}