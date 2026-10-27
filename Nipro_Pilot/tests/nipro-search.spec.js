import { test } from '@playwright/test';
import { NiproSearch } from '../pages/NiproSearch';

test(
    'Search, filter and invalid search @smoke @regression',
    async ({ page }) => {
        const searchPage = new NiproSearch(page);

        await page.goto('/');

        await searchPage.openSearch();

        await searchPage.searchNipro();

        await searchPage.filterBusiness();

        await searchPage.clearAndSearchInvalid();
    }
);
