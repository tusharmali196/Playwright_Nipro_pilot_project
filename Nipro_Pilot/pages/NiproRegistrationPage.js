import { expect } from '@playwright/test';

export class NiproRegistrationPage {
    constructor(page) {
        this.page = page;

        // Registration fields
        this.firstName = page.locator('#edit-field-first-name-0-value');
        this.lastName = page.locator('#edit-field-last-name-0-value');
        this.organisation = page.locator('#edit-field-your-organisation-0-value');
        this.role = page.locator('#edit-field-your-role-0-value');
        this.country = page.locator('#edit-field-location-0-value--2');
        this.email = page.locator('#edit-mail');

        // Checkboxes
        this.surefuserCheckbox = page.locator('[data-drupal-selector="edit-field-surefuser-access-value"]');

        this.privacyCheckbox = page.locator('[data-drupal-selector="edit-field-privacy-policy-value"]');

        // Submit button
        this.requestAccountButton = page.locator('#edit-submit');

        // Existing email validation
        this.emailError = page
            .locator('#edit-mail')
            .locator('xpath=../..')
            .locator('.text-red-600');
    }

    async goto() {
       await this.page.goto('/user/register', { waitUntil: 'domcontentloaded'});
    }

    async verifyRegistrationPage() {
        await expect(this.firstName).toBeVisible();
        await expect(this.lastName).toBeVisible();
        await expect(this.organisation).toBeVisible();
        await expect(this.role).toBeVisible();
        await expect(this.country).toBeVisible();
        await expect(this.email).toBeVisible();
        await expect(this.surefuserCheckbox).toBeVisible();
        await expect(this.privacyCheckbox).toBeVisible();
        await expect(this.requestAccountButton).toBeVisible();
    }

    async enterRegistrationDetails() {
        await this.firstName.fill('QA Test');
        await this.lastName.fill('QA');
        await this.organisation.fill('QED42');
        await this.role.fill('QA Engineer');

        await this.country.selectOption({ label: 'India' });

        await this.email.fill('Test123456789@gmail.com');
    }

    async acceptPrivacyPolicy() {
        await this.privacyCheckbox.check();
    }

    async submitRegistration() {
        await this.requestAccountButton.click();
    }

    async verifyRegistrationSuccess() {
    await expect(this.page.locator('body')).toContainText('Your account is currently pending approval');
   }   

    async verifyExistingEmailError() {
        await expect(this.emailError).toBeVisible();
        await expect(this.emailError).toContainText('already taken');
    }

    async verifyPrivacyCheckboxRequired() {
    await expect(this.privacyCheckbox).toHaveAttribute('required', 'required');
    }
}
