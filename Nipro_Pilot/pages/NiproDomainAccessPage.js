import { expect } from '@playwright/test';

export class NiproDomainAccessPage {
    constructor(page) {
        this.page = page;

        this.domainAccess = page.locator('fieldset[data-drupal-selector="edit-field-domain-access"]');

        this.globalCheckbox = this.domainAccess.getByLabel('Global', {
            exact: true
        });

        this.indiaCheckbox = this.domainAccess.getByLabel('India', {
            exact: true
        });

        this.usaCheckbox = this.domainAccess.getByLabel('United States', {
            exact: true
        });

        this.saveButton = page.locator('#gin-sticky-edit-submit');

        this.accessDeniedMessage = page.locator('main').filter({
            hasText: /Access Denied|not authorized to access this page/i
        });

        this.pageTitle = page.getByText('News Listing Page - UAT', {
            exact: true
        });
    }

    async openEditPage() {
        await this.page.goto('/node/566/edit');
        await expect(this.pageTitle).toBeVisible();
    }

    async verifyGlobalSelected() {
        await expect(this.globalCheckbox).toBeChecked();
    }

    async selectGlobalOnly() {
        if (!(await this.globalCheckbox.isChecked())) {
            await this.globalCheckbox.check();
        }

        if (await this.indiaCheckbox.isChecked()) {
            await this.indiaCheckbox.uncheck();
        }

        if (await this.usaCheckbox.isChecked()) {
            await this.usaCheckbox.uncheck();
        }

        await this.saveButton.click();
    }

    async selectIndiaAndUSA() {
        if (await this.globalCheckbox.isChecked()) {
            await this.globalCheckbox.uncheck();
        }

        if (!(await this.indiaCheckbox.isChecked())) {
            await this.indiaCheckbox.check();
        }

        if (!(await this.usaCheckbox.isChecked())) {
            await this.usaCheckbox.check();
        }

        await this.saveButton.click();
    }

    async verifyAccessDenied() {
        await expect(this.accessDeniedMessage).toBeVisible();
    }

    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
    }
}
