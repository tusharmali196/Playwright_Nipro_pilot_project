import { expect } from '@playwright/test';

export class NiproLandingPage {
    constructor(page) {
        this.page = page;

        this.addContent = page.locator('a.button.button--action.button--primary[href="/node/add"]');

        this.landingPageType = page.locator('a[href="/node/add/landing_page"]').last();

        this.title = page.locator('[data-drupal-selector="edit-title-0-value"]');

        this.moderationState = page.locator('[data-drupal-selector="edit-moderation-state-0-state"]');

        this.saveContent = page.locator('[data-drupal-selector="gin-sticky-edit-submit"]');
    }

    async openContent() {
        await this.page.goto('/admin/content', { waitUntil: 'domcontentloaded' });

        await expect(this.addContent).toBeVisible({ timeout: 15000 });

        await this.addContent.click();

        await expect(this.landingPageType).toBeVisible({ timeout: 15000 });
    }

    async openLandingPageForm() {
        await this.landingPageType.click();

        await expect(this.title).toBeVisible({ timeout: 15000 });
    }

    async createLandingPage(title) {
        await this.title.fill(title);

        await this.moderationState.selectOption({ label: 'Published' });

        await this.saveContent.click();

        await expect(this.page.getByText(title, { exact: true }).first()).toBeVisible({ timeout: 20000 });
    }
}
