import { test } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage.js';
import { NiproProductPage } from '../pages/NiproProductPage.js';

test(
    'Admin creates product and verifies login block',
    {
        tag: ['@smoke', '@regression']
    },
    async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const productPage = new NiproProductPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await productPage.gotoCreateProduct();

        await productPage.fillMandatoryFields();

        await productPage.enableProtectedSetting();

        await productPage.publishAndSave();

        const productUrl = page.url();

        await productPage.checkLoginBlock(productUrl);
    }
);
