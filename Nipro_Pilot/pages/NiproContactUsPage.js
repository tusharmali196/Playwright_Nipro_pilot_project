import { expect } from '@playwright/test';

export class NiproContactUsPage {
    constructor(page) {
        this.page = page;

        this.firstName = page.locator('[data-drupal-selector="edit-first-name"]');
        this.lastName = page.locator('[data-drupal-selector="edit-last-name"]');
        this.email = page.locator('[data-drupal-selector="edit-email"]');
        this.reachingOutAs = page.locator('[data-drupal-selector="edit-i-am-reaching-out-as-a"]');
        this.interestedIn = page.locator('[data-drupal-selector="edit-i-am-interested-in"]');
        this.country = page.locator('[data-drupal-selector="edit-country"]');
        this.message = page.locator('[data-drupal-selector="edit-message"]');
        this.sendMessage = page.locator('[data-drupal-selector="edit-actions-submit"]');

        this.successMessage = page.getByText(
            'Thank you! Your submission has been received.',
            { exact: true }
        );

        this.firstNameError = page.getByText(
            'First Name field is required.',
            { exact: true }
        );

        this.lastNameError = page.getByText(
            'Last Name field is required.',
            { exact: true }
        );

        this.emailError = page.getByText(
            'Email field is required.',
            { exact: true }
        );

        this.reachingOutAsError = page.getByText(
            'I am reaching out as a field is required.',
            { exact: true }
        );

        this.interestedInError = page.getByText(
            'I am interested in field is required.',
            { exact: true }
        );
    }

    async goto() {
        await this.page.goto(`${process.env.NIPRO_BASE_URL}/contact-us-v2-demo-7th`);
    }

    async verifyForm() {
        await expect(this.firstName).toBeVisible();
        await expect(this.lastName).toBeVisible();
        await expect(this.email).toBeVisible();
        await expect(this.reachingOutAs).toBeVisible();
        await expect(this.interestedIn).toBeVisible();
        await expect(this.country).toBeVisible();
        await expect(this.message).toBeVisible();
        await expect(this.sendMessage).toBeVisible();
    }

    async fillForm() {
        await this.firstName.fill('Automation');
        await this.lastName.fill('Test');
        await this.email.fill(`test${Date.now()}@example.com`);
        await this.reachingOutAs.selectOption({ label: 'Doctor' });
        await this.interestedIn.selectOption({ label: 'Webinars' });
        await this.country.selectOption({ label: 'India' });
        await this.message.fill('This is an automation test.');
    }

    async submit() {
        await this.sendMessage.click();
    }

    async verifySuccess() {
        await expect(this.successMessage).toBeVisible();
    }

    async verifyRequiredErrors() {
        await expect(this.firstNameError).toBeVisible();
        await expect(this.lastNameError).toBeVisible();
        await expect(this.emailError).toBeVisible();
        await expect(this.reachingOutAsError).toBeVisible();
        await expect(this.interestedInError).toBeVisible();
    }

    async fillInvalidEmailForm() {
        await this.firstName.fill('Automation');
        await this.lastName.fill('Test');
        await this.email.fill('invalid-email');
        await this.reachingOutAs.selectOption({ label: 'Doctor' });
        await this.interestedIn.selectOption({ label: 'Webinars' });
        await this.country.selectOption({ label: 'India' });
        await this.message.fill('Invalid email test.');
    }
}
