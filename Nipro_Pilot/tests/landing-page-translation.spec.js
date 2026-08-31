import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproLandingPageTranslation } from '../pages/NiproLandingPageTranslation';

test(
    'Admin creates Japanese translation of Landing Page',
    {
        tag: ['@smoke', '@regression']
    },
    async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const translationPage = new NiproLandingPageTranslation(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await page.goto(
            `${process.env.NIPRO_BASE_URL}/node/566`
        );

        await translationPage.openTranslations();

        await translationPage.addJapaneseTranslation();

        await translationPage.updateJapaneseTitle(
            'News Listing Page - UAT - JP'
        );

        await translationPage.saveJapaneseTranslation();
        await expect(page).toHaveURL(/\/ja\//);

        await expect(
            page.getByText('News Listing Page - UAT - JP', { exact: true })).toBeVisible ({
            timeout: 30000
        });
    }
);
