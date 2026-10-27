import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproDomainAccessPage } from '../pages/NiproDomainAccessPage';

test.describe.configure({ mode: 'serial' });

test.describe('News Listing Page - Domain Access', () => {

    test('Verify Global domain is selected', async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const domainPage = new NiproDomainAccessPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await page.goto('/news-listing-page-uat');

        await domainPage.verifyPageLoaded();

        await domainPage.openEditPage();

        await domainPage.verifyGlobalSelected();
    });

    test('Global page should be denied on India domain', async ({ page, browser }) => {
        const adminPage = new NiproAdminPage(page);
        const domainPage = new NiproDomainAccessPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await domainPage.openEditPage();

        await domainPage.selectGlobalOnly();

        const context = await browser.newContext();
        const indiaPage = await context.newPage();

        const response = await indiaPage.goto('/india/news-listing-page-uat');

        expect(response.status()).toBe(403);

        const indiaDomainPage = new NiproDomainAccessPage(indiaPage);

        await indiaDomainPage.verifyAccessDenied();

        await context.close();
    });

    test('Global page should be denied on USA domain', async ({page, browser}) => {
        
        const adminPage = new NiproAdminPage(page);
        const domainPage = new NiproDomainAccessPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await domainPage.openEditPage();

        await domainPage.selectGlobalOnly();

        const context = await browser.newContext();
        const usaPage = await context.newPage();

        const response = await usaPage.goto('/usa/news-listing-page-uat');

        expect(response.status()).toBe(403);

        const usaDomainPage = new NiproDomainAccessPage(usaPage);

        await usaDomainPage.verifyAccessDenied();

        await context.close();
    });

    test('India domain should load when India access is enabled', async ({page, browser}) => {
        const adminPage = new NiproAdminPage(page);
        const domainPage = new NiproDomainAccessPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await domainPage.openEditPage();

        await domainPage.selectIndiaAndUSA();

        const context = await browser.newContext();
        const indiaPage = await context.newPage();

        const response = await indiaPage.goto('/india/news-listing-page-uat');

        expect(response.status()).toBe(200);

        const indiaDomainPage = new NiproDomainAccessPage(indiaPage);

        await indiaDomainPage.verifyPageLoaded();

        await context.close();
    });

    test('USA domain should load when USA access is enabled', async ({page, browser}) => {
        const adminPage = new NiproAdminPage(page);
        const domainPage = new NiproDomainAccessPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await domainPage.openEditPage();

        await domainPage.selectIndiaAndUSA();

        const context = await browser.newContext();
        const usaPage = await context.newPage();

        const response = await usaPage.goto('/usa/news-listing-page-uat');

        expect(response.status()).toBe(200);

        const usaDomainPage = new NiproDomainAccessPage(usaPage);

        await usaDomainPage.verifyPageLoaded();

        await context.close();
    });

});
