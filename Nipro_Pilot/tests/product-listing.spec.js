import { test } from '@playwright/test';
import { NiproProductListingPage } from '../pages/NiproProductListingPage.js';

test.describe('Product Listing', () => {

    test('User can view product listing', async ({ page }) => {
        const productListing =
            new NiproProductListingPage(page);

        await productListing.goto();
        await productListing.verifyListing();
    });

    test('User can search product using auto search', async ({ page }) => {
        const productListing =
            new NiproProductListingPage(page);

        await productListing.goto();
        await productListing.searchProduct('Test Product');
        await productListing.verifySearchResult('Test Product');
    });

    test('User gets no results for invalid product search', async ({ page }) => {
        const productListing =
            new NiproProductListingPage(page);

        await productListing.goto();
        await productListing.searchInvalidProduct('afdafdaf');
        await productListing.verifyNoSearchResults();
    });

    test('User can search with empty search field', async ({ page }) => {
        const productListing =
            new NiproProductListingPage(page);

        await productListing.goto();
        await productListing.searchEmpty();
        await productListing.verifyDefaultResults();
    });

    test('User can filter products and clear filters', async ({ page }) => {
        const productListing =
            new NiproProductListingPage(page);

        await productListing.goto();
        await productListing.applyProductFilters();
        await productListing.verifyFilteredResults();

        await productListing.clearFilters();
        await productListing.verifyFiltersCleared();
    });

    test('User can navigate between product listing pages', async ({ page }) => {
        const productListing =
           new NiproProductListingPage(page);

        await productListing.goto();

        await productListing.medicalDevices.click();

        await productListing.goToPageTwo();

        await productListing.goToPageOne();

        await productListing.clearFilters();

        await productListing.verifyDefaultResults();
    });

});
