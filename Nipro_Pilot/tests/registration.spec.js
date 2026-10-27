import { test } from '@playwright/test';
import { NiproRegistrationPage } from '../pages/NiproRegistrationPage';

test.describe('Nipro Registration', () => {

    test('User can submit registration request', async ({ page }) => {
        const registrationPage = new NiproRegistrationPage(page);

        await registrationPage.goto();

        await registrationPage.verifyRegistrationPage();

        await registrationPage.enterRegistrationDetails();

        await registrationPage.acceptPrivacyPolicy();

        await registrationPage.submitRegistration();

        await registrationPage.verifyRegistrationSuccess();
    });


    test('Existing email validation', async ({ page }) => {
        const registrationPage = new NiproRegistrationPage(page);

        await registrationPage.goto();

        await registrationPage.enterRegistrationDetails();

        // Existing email
        await registrationPage.email.fill('tushar.mali@qed42.com');

        await registrationPage.acceptPrivacyPolicy();

        await registrationPage.submitRegistration();

        await registrationPage.verifyExistingEmailError();
    });


    test('Privacy policy checkbox validation', async ({ page }) => {
        const registrationPage = new NiproRegistrationPage(page);

        await registrationPage.goto();

        await registrationPage.enterRegistrationDetails();

        // Do not select privacy checkbox

        await registrationPage.submitRegistration();

        await registrationPage.verifyPrivacyCheckboxRequired();
    });

});
