import { expect } from '@playwright/test';

export class NiproSurefuserCalculatorPage {
    constructor(page) {
        this.page = page;

        this.dosage = page.locator(
            '[data-drupal-selector="edit-dosage"]'
        );

        this.duration = page.locator(
            '[data-drupal-selector="edit-duration"]'
        );

        this.flowRate = page.locator(
            '[data-drupal-selector="edit-flow-rate"]'
        );

        this.volume = page.locator(
            '[data-drupal-selector="edit-volume"]'
        );

        this.calculateButton = page.locator(
            '[data-drupal-selector="edit-submit"]'
        );

        this.resetButton = page.locator(
            '[data-drupal-selector="edit-reset"]'
        );

        this.results = page.locator(
            '[data-drupal-selector="edit-results"]'
        );

        this.dosageError = page.getByText(
            '5FU Dosage (mg) field is required.',
            { exact: true }
        );

        this.durationError = page.getByText(
            'Duration (h) field is required.',
            { exact: true }
        );
    }

    async goto() {
        await this.page.goto(
            '/surefuser-calculator-form-demo-15th',
            { waitUntil: 'domcontentloaded' }
        );

        await expect(this.dosage).toBeVisible();
    }

    async enterCalculationDetails() {
        await this.dosage.fill('20');
        await this.duration.fill('29');

        await this.flowRate.selectOption({
            label: '1.5'
        });

        await this.volume.selectOption({
            label: '50'
        });
    }

    async calculate() {
        await this.calculateButton.click();
    }

    async verifyCalculationResults() {
        await expect(this.results).toBeVisible();

        await expect(
            this.results.getByText('0.4', { exact: true })
        ).toBeVisible();

        await expect(
            this.results.getByText('43.53', { exact: true })
        ).toBeVisible();

        await expect(
            this.results.getByText('43.93', { exact: true })
        ).toBeVisible();

        await expect(
            this.results.getByText('1.515', { exact: true })
        ).toBeVisible();
    }

    async resetToDefault() {
        await this.resetButton.click();
    }

    async verifyResetValues() {
        await expect(this.dosage).toHaveValue('');
        await expect(this.duration).toHaveValue('');
        await expect(this.flowRate).toHaveValue('1.5');
        await expect(this.volume).toHaveValue('50');
    }

    async submitEmptyForm() {
        await this.calculateButton.click();
    }

    async verifyRequiredFieldErrors() {
        await expect(this.dosageError).toBeVisible();
        await expect(this.durationError).toBeVisible();
    }
}
