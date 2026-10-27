import { expect } from '@playwright/test';

export class NiproNewsListingPage {
    constructor(page) {
        this.page = page;

        this.searchInput = page.locator('input[data-drupal-selector="edit-title"]');
        this.noResultsMessage = page.locator('.view-empty');

        this.offeringFilter = page.locator('details[data-drupal-selector="edit-field-expertise-target-id-collapsible"]');
        this.countryFilter = page.locator('details[data-drupal-selector="edit-field-country-target-id-collapsible"]');
        this.targetAudienceFilter = page.locator('details[data-drupal-selector="edit-field-target-audience-target-id-collapsible"]');

        this.offeringOption = (value) =>
            this.offeringFilter.locator('label.option').filter({ hasText: value });

        this.countryOption = (value) =>
            this.countryFilter.locator('label.option').filter({ hasText: value});

        this.targetAudienceOption = (value) =>
            this.targetAudienceFilter.locator('label.option').filter({ hasText: value });

        this.loadingIndicator = page.locator('.ajax-progress.ajax-progress-fullscreen');

        this.newsItems = page.locator('.view-news .view-content .nipro-media-card:visible');

        this.pager = page.locator('nav.pager.nipro-pager');

        this.nextPage = page.locator('nav.pager.nipro-pager a[rel="next"]');

        this.previousPage = page.locator('nav.pager.nipro-pager a[rel="prev"]');

        this.countryChip = (value) =>
            page.locator('.filter-chips-container .filter-chip').filter({
                hasText: value
            });

        this.clearFilter = page.getByRole('button', {  name: 'Clear Filter'});
    }

    async openPage() {
        await this.page.goto('/news-listing-page-uat', {
            waitUntil: 'domcontentloaded'
        });

        await expect(this.page.getByText('All News', { exact: true })).toBeVisible();
    }

    async waitForNewsItems() {
        await expect(this.newsItems.first()).toBeVisible({
            timeout: 30000
        });
    }

    async waitForLoadingToFinish() {
        if (await this.loadingIndicator.count()) {
            await this.loadingIndicator.waitFor({
                state: 'hidden',
                timeout: 30000
            });
        }
    }

    async selectOffering(value) {
        await this.offeringFilter.locator('summary').click();

        const option = this.offeringOption(value);

        await expect(option).toBeVisible();
        await option.click();

        await this.waitForLoadingToFinish();
        await this.waitForNewsItems();
    }

    async selectCountry(value) {
        await this.countryFilter.locator('summary').click();

        const option = this.countryOption(value);

        await expect(option).toBeVisible();
        await option.click();

        await this.waitForLoadingToFinish();
    }

    async selectTargetAudience(value) {
        await this.targetAudienceFilter.locator('summary').click();

        const option = this.targetAudienceOption(value);

        await expect(option).toBeVisible();
        await option.click();

        await this.waitForLoadingToFinish();
    }

    async clearFilters() {
        await this.clearFilter.click();

        await this.waitForLoadingToFinish();
        await this.waitForNewsItems();
    }

    async searchNews(value) {
        await this.searchInput.fill(value);
        await this.searchInput.press('Enter');

        await this.waitForLoadingToFinish();
    }
}
