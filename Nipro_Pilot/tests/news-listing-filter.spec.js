import { test, expect } from '@playwright/test';
import { NiproNewsListingPage } from '../pages/NiproNewsListingPage';

test.describe('News Listing Page - Filters', () => {
    test.beforeEach(async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.openPage();
        await newsPage.waitForNewsItems();
    });

    test('Verify Our Offerings filter', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.selectOffering('Diabetes Care');

        await expect(newsPage.newsItems).toHaveCount(2);
        await expect(newsPage.newsItems.first()).toBeVisible();
    });

    test('Verify Country filter with multiple selections', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.selectCountry('India');

        await expect(newsPage.countryChip('India')).toBeVisible();

        await newsPage.selectCountry('Italy');

        await expect(newsPage.countryChip('India')).toBeVisible();
        await expect(newsPage.countryChip('Italy')).toBeVisible();
        await expect(newsPage.newsItems.first()).toBeVisible();
    });

    test('Verify Target Audience filter', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.selectTargetAudience('Doctors');

        await expect(newsPage.newsItems.first()).toBeVisible();
        await expect(newsPage.newsItems).not.toHaveCount(0);
    });

    test('Verify Clear Filter', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.selectCountry('India');

        await expect(newsPage.countryChip('India')).toBeVisible();

        await newsPage.clearFilters();

        await expect(newsPage.countryChip('India')).not.toBeVisible();
        await expect(newsPage.newsItems.first()).toBeVisible();
    });

    test('Verify pagination with Next and Previous', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await expect(newsPage.newsItems).toHaveCount(6);
        await expect(newsPage.pager).toBeVisible();
        await expect(newsPage.previousPage).not.toBeVisible();
        await expect(newsPage.nextPage).toBeVisible();

        await newsPage.nextPage.click();

        await newsPage.waitForLoadingToFinish();
        await newsPage.waitForNewsItems();

        await expect(newsPage.newsItems).toHaveCount(6);
        await expect(newsPage.previousPage).toBeVisible();

        await newsPage.previousPage.click();

        await newsPage.waitForLoadingToFinish();
        await newsPage.waitForNewsItems();

        await expect(newsPage.newsItems).toHaveCount(6);
        await expect(newsPage.previousPage).not.toBeVisible();
        await expect(newsPage.nextPage).toBeVisible();
    });

    test('Verify valid search results', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.searchNews('Nipro');

        await expect(newsPage.newsItems.first()).toBeVisible();
        await expect(newsPage.newsItems).not.toHaveCount(0);

        await newsPage.clearFilters();
    });

    test('Verify invalid search shows no results', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.searchNews('SFSAFSAFSAF');

        await expect(newsPage.noResultsMessage).toBeVisible();
        await expect(newsPage.noResultsMessage).toHaveText( 'No results found.' );

        await newsPage.clearFilters();

        await newsPage.waitForNewsItems();
        await expect(newsPage.newsItems.first()).toBeVisible();
    });

    test('Verify all three filters together and clear filters', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await newsPage.selectOffering('Renal Care');
        await newsPage.selectCountry('India');
        await newsPage.selectTargetAudience('Doctors');

        await newsPage.waitForLoadingToFinish();
        await newsPage.waitForNewsItems();

        await expect(newsPage.newsItems.first()).toBeVisible();
        await expect(newsPage.newsItems).not.toHaveCount(0);
        await expect(newsPage.countryChip('India')).toBeVisible();

        await newsPage.clearFilters();

        await newsPage.waitForNewsItems();

        await expect(newsPage.newsItems.first()).toBeVisible();
        await expect(newsPage.newsItems).toHaveCount(6);
    });

    test('Verify India country page loads with default India filter', async ({ page }) => {
        const newsPage = new NiproNewsListingPage(page);

        await page.goto('/india/news-listing-page-uat', {
            waitUntil: 'domcontentloaded'
        });

        await expect(
            page.getByText('All News', { exact: true })).toBeVisible();

        await newsPage.waitForNewsItems();

        await expect(newsPage.countryChip('India')).toBeVisible();

        await expect(newsPage.newsItems.first()).toBeVisible();
    });
});
