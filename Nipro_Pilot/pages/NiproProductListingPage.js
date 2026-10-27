import { expect } from '@playwright/test';

export class NiproProductListingPage {
    constructor(page) {
        this.page = page;

        this.searchInput = page.locator(
            '[data-drupal-selector="edit-search-api-fulltext"]'
        );

        this.searchButton = page.locator(
            '[data-drupal-selector="edit-submit-product-search-listing"]'
        );

        this.medicalDevices = page.getByRole('link', {
            name: 'Medical Devices',
            exact: true
        });

        this.productOffering = page.locator(
            'select[data-drupal-facet-id="product_expertise"]'
        );

        this.clearFilter = page.locator(
            'a.reset-all-filters'
        );

        this.pagination = page.locator(
            '[aria-label="Pagination"]'
        );

        this.nextButton = this.pagination.locator(
            'a[rel="next"]'
        );

        this.previousButton = this.pagination.locator(
            'a[rel="prev"]'
        );

        this.pageOne = this.pagination.getByRole('link', {
            name: 'Current page 1',
            exact: true
        });

        this.pageTwo = this.pagination.getByRole('link', {
            name: 'Page 2',
            exact: true
        });

        this.products = page.getByText(
            'View Product',
            { exact: true }
        );
    }

    async goto() {
        await this.page.goto(
            `${process.env.NIPRO_BASE_URL}/products`,
            { waitUntil: 'domcontentloaded' }
        );

        await expect(
            this.page.getByRole('heading', {
                name: 'All Products'
            })
        ).toBeVisible();
    }

    async verifyListing() {
        await expect(this.searchInput).toBeVisible();
        await expect(this.searchButton).toBeVisible();
        await expect(this.medicalDevices).toBeVisible();
        await expect(this.products.first()).toBeVisible();
        await expect(this.pagination).toBeVisible();

        await expect(
            this.page.getByText('Showing 31 Results', {
                exact: true
            })
        ).toBeVisible();
    }

    async searchProduct(productName) {
        await this.searchInput.fill(productName);

        const suggestion = this.page.locator(
            '.autocomplete-suggestion-user-input'
        ).first();

        await expect(suggestion).toBeVisible();
        await suggestion.click();
    }

    async verifySearchResult(productName) {
        await expect(
            this.page.getByText(productName, {
                exact: true
            })
        ).toBeVisible();
    }

    async searchInvalidProduct(productName) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async verifyNoSearchResults() {
        await expect(
            this.page.getByText('Showing 0 Results', {
                exact: true
            })
        ).toBeVisible();

        await expect(
            this.page.getByText('No result found', {
                exact: true
            })
        ).toBeVisible();
    }

    async searchEmpty() {
        await this.searchInput.fill('');
        await this.searchButton.click();
    }

    async verifyDefaultResults() {
        await expect(
            this.page.getByText('Showing 31 Results', {
                exact: true
            })
        ).toBeVisible();
    }

    async applyProductFilters() {
        await this.medicalDevices.click();

        await this.productOffering.selectOption({
            label: 'Renal Care'
        });
    }

    async verifyFilteredResults() {
        await expect(
            this.page.getByText(/Showing \d+ Results/)
        ).toBeVisible();

        await expect(
            this.products.first()
        ).toBeVisible();
    }

    async clearFilters() {
        await this.clearFilter.click();
    }

    async verifyFiltersCleared() {
        await expect(
            this.page.getByText('Showing 31 Results', {
                exact: true
            })
        ).toBeVisible();

        await expect(
            this.productOffering
        ).toHaveValue('');
    }

    async verifyPageOne() {
        await expect(this.pageOne).toBeVisible();

        await expect(
            this.pagination.getByText('Previous', {
                exact: true
            })
        ).toBeVisible();

        await expect(
            this.previousButton
        ).not.toBeVisible();
    }

    async goToPageTwo() {
        await this.nextButton.click();

        await expect(this.page).toHaveURL(
            /page=1/
        );

        await expect(
            this.previousButton
        ).toBeVisible();
    }

    async verifyPageTwo() {
        await expect(this.pageTwo).toBeVisible();
        await expect(this.previousButton).toBeVisible();
        await expect(this.nextButton).toBeVisible();
    }

    async goToPageOne() {
        await this.previousButton.click();

        await expect(this.page).toHaveURL(
            /page=0/
        );
    }

    async verifyReturnedToPageOne() {
        await expect(this.pageOne).toBeVisible();
    }
}
