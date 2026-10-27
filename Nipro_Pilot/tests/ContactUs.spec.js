import { test } from '@playwright/test';
import { NiproContactUsPage } from '../pages/NiproContactUsPage.js';

test.describe('Contact Us Form', () => {

    test('Verify Contact Us form', async ({ page }) => {
        const contactUsPage = new NiproContactUsPage(page);

        await contactUsPage.goto();
        await contactUsPage.verifyForm();
    });

    test('Submit Contact Us form successfully', async ({ page }) => {
        const contactUsPage = new NiproContactUsPage(page);

        await contactUsPage.goto();
        await contactUsPage.fillForm();
        await contactUsPage.submit();
        await contactUsPage.verifySuccess();
    });

    test('Verify mandatory field error messages', async ({ page }) => {
        const contactUsPage = new NiproContactUsPage(page);

        await contactUsPage.goto();
        await contactUsPage.submit();
        await contactUsPage.verifyRequiredErrors();
    });

    test('Verify invalid email validation', async ({ page }) => {
        const contactUsPage = new NiproContactUsPage(page);

        await contactUsPage.goto();
        await contactUsPage.fillInvalidEmailForm();
        await contactUsPage.submit();
    });
});
