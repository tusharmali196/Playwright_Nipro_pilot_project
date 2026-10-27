import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage.js';
import { NiproSurefuserCalculatorPage } from '../pages/NiproSurefuserCalculatorPage.js';

test.describe('SureFuser+ Calculator', () => {

    test('Admin can calculate SureFuser+ results', async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const calculatorPage =
            new NiproSurefuserCalculatorPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await calculatorPage.goto();
        await calculatorPage.enterCalculationDetails();
        await calculatorPage.calculate();
        await calculatorPage.verifyCalculationResults();
    });

    test('Admin can reset SureFuser+ calculator to default', async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const calculatorPage =
            new NiproSurefuserCalculatorPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await calculatorPage.goto();
        await calculatorPage.enterCalculationDetails();
        await calculatorPage.resetToDefault();
        await calculatorPage.verifyResetValues();
    });

    test('SureFuser+ calculator shows required field errors', async ({ page }) => {
        const adminPage = new NiproAdminPage(page);
        const calculatorPage =
            new NiproSurefuserCalculatorPage(page);

        await adminPage.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await calculatorPage.goto();
        await calculatorPage.submitEmptyForm();
        await calculatorPage.verifyRequiredFieldErrors();
    });

    test('Anonymous user cannot access SureFuser+ calculator', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(
            `${process.env.NIPRO_BASE_URL}/surefuser-calculator-form-demo-15th`,
            { waitUntil: 'domcontentloaded' }
        );

        await expect(
            page.locator('[data-drupal-selector="edit-dosage"]')
        ).not.toBeVisible();

        await context.close();
    });

});