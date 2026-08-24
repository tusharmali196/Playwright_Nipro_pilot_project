import { test } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproLandingPageLayout } from '../pages/NiproLandingPageLayout';

test(
    'Admin adds News Listing Block to Landing Page',
    {
        tag: ['@smoke', '@regression']
    },
    async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const landingPageLayout = new NiproLandingPageLayout(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await page.goto(
            `${process.env.NIPRO_BASE_URL}/node/933/edit`
        );

        await landingPageLayout.openLayout();

        await landingPageLayout.addOneColumnSection();

        await landingPageLayout.addNewsListingBlock();

        await landingPageLayout.saveLayoutAndView();

        await landingPageLayout.verifyNewsBlockAsAnonymous();
    }
);
