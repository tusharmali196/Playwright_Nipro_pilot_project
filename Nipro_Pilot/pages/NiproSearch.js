import { expect } from '@playwright/test';

export class NiproSearch {
    constructor(page) {
        this.page = page;

        this.headerSearchButton = page.locator('#toggle-search');
        this.headerSearchInput = page.locator('#edit-search-terms');

        this.resultsSearchInput = this.page.locator('input[data-drupal-selector="edit-search-api-fulltext"]');

        this.resultsSearchButton = this.page.getByRole(
            'button',
             { name: 'Search', exact: true }
        );

        this.resultsCount = page.locator('.search-summary');

        this.filterType = page.locator('select[data-drupal-selector="edit-type"]');

        this.clearFilter = page.getByRole('button', { name: 'CLEAR FILTER', exact: true });

        this.results = page.locator('.view-content .views-row');

        this.autocompleteItems = page.locator('.ui-autocomplete li');
    }

    async openSearch() {
        await this.headerSearchButton.click();

        await expect(this.headerSearchInput).toBeVisible();
    }

    async searchNipro() {
        await this.headerSearchInput.fill('Nipro');

        await expect(this.autocompleteItems.first()).toBeVisible();

        await this.autocompleteItems.first().click();

        await expect(this.page).toHaveURL(/\/search/);

        await expect(this.resultsCount).toContainText(
            /Found \d+ results for/
        );

        await expect(this.filterType).toBeVisible();
        await expect(this.clearFilter).toBeVisible();
    }

    async filterBusiness() {
    // Make sure filter is available
       await expect(this.filterType).toBeVisible();

    // Select Business
       await this.filterType.selectOption({ value: '1' });

    // Verify selection
       await expect(this.filterType).toHaveValue('1');

    // Submit the exposed Drupal search form
    const filterForm = this.filterType.locator('xpath=ancestor::form');

       await Promise.all([
        this.page.waitForLoadState('domcontentloaded'),
        filterForm.evaluate((form) => {
            form.requestSubmit();
        })
    ]);

    // Verify URL contains Business filter
       await expect(this.page).toHaveURL(/type=1/, {
        timeout: 30000
    });

    // Verify filtered result count
       await expect(this.resultsCount).toContainText(
        'Found 9 results for',
        {
            timeout: 30000
        }
    );

    // Verify Business result exists
    const businessResult = this.results
        .filter({
            has: this.page.locator(
                '.nipro-text-card__badge',
                { hasText: 'Business' }
            )
        })
        .first();

       await expect(businessResult).toBeVisible();
    }

    async clearAndSearchInvalid() {
    // 1. Clear Business filter
       await this.clearFilter.click();

    // 2. Wait until filter is reset
       await expect(this.filterType).toHaveValue('All', {
        timeout: 30000
    });

    // 3. Wait for results search box
       await expect(this.resultsSearchInput).toBeVisible({
        timeout: 30000
    });

    // 4. Enter invalid search text
    const invalidText = 'asfsafafafasfsaf';

       await this.resultsSearchInput.fill(invalidText);

    // Verify text was actually entered
       await expect(this.resultsSearchInput).toHaveValue(invalidText);

    // 5. Submit search using Enter
       await this.resultsSearchInput.press('Enter');

    // 7. Now verify zero results
       await expect(this.resultsCount).toContainText(
        'Found 0 results for',
        {
            timeout: 30000
        }
    );

    // 8. Verify filter controls
      await expect(this.filterType).toBeVisible();
      await expect(this.clearFilter).toBeVisible();
    }

}
