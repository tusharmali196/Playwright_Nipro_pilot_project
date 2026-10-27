import { expect } from '@playwright/test';

export class NiproLandingPageTranslation {
    constructor(page) {
        this.page = page;

        this.translateLink = page.getByRole('link', {
            name: 'Translate',
            exact: true
        });

        this.japaneseRow = page.getByText('Japanese', {
            exact: true
        });

        this.addJapanese = page.locator('a[href*="/translations/add/en/ja"]');

        this.title = page.locator('[data-drupal-selector="edit-title-0-value"]');

        this.saveTranslation = page.locator('[data-drupal-selector="gin-sticky-edit-submit"]');
    }

    async openTranslations() {
        await expect(this.translateLink).toBeVisible({
            timeout: 20000
        });

        await this.translateLink.click();

        await expect(this.japaneseRow).toBeVisible({
            timeout: 20000
        });
    }

    async addJapaneseTranslation() {
        await expect(this.addJapanese).toBeVisible({
            timeout: 20000
        });

        await this.addJapanese.click();

        await expect(this.title).toBeVisible({
            timeout: 20000
        });
    }

    async updateJapaneseTitle(title) {
        await this.title.fill(title);
    }

    async saveJapaneseTranslation() {
        await this.saveTranslation.click();
    }
}
