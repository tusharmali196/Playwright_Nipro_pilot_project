import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproLandingPage } from '../pages/NiproLandingPage';

test(
    'Admin creates Landing Page @smoke @regression',
    async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const landingPage = new NiproLandingPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await landingPage.openContent();
        await landingPage.openLandingPageForm();

        await landingPage.createLandingPage('Test Landing Page Automation');

        await expect(page.getByText('Test Landing Page Automation', { exact: true }).first()).toBeVisible();
    }
);
