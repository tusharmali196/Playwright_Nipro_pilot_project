import { expect } from '@playwright/test';

export class NiproFindManualPage {
    constructor(page) {
        this.page = page;
        this.baseUrl = process.env.IFU_BASE_URL;

        this.europeRegion = page.locator(
            'path.map-region[data-region="europe"]'
        ).first();

        this.unitedKingdom = page.getByRole('link', {
            name: 'United Kingdom',
            exact: true
        });

        this.manualHeading = page.getByRole('heading', {
            name: 'Find a Manual',
            exact: true
        });

        this.searchInput = page.getByPlaceholder(
            'Search by reference code and product name...'
        );

        this.searchButton = page.getByRole('button', {
            name: 'Search',
            exact: true
        });

        this.downloadPdf = page.getByRole('link', {
            name: 'Download PDF',
            exact: true
        });

        this.mapLink = page.getByRole('link', {
            name: 'Map',
            exact: true
        });
    }

    async gotoHome() {
        await this.page.goto(this.baseUrl, {
            waitUntil: 'domcontentloaded'
        });

        await expect(
            this.page.getByText(
                /Quickly search and access NIPRO.*IFUs/
            )
        ).toBeVisible();
    }

    async openUnitedKingdomManuals() {
        await this.europeRegion.click();

        await expect(this.unitedKingdom).toBeVisible();

        await this.unitedKingdom.click();

        await expect(this.page).toHaveURL(
            /\/find-a-manual\?country=385/
        );

        await expect(this.manualHeading).toBeVisible();
        await expect(this.searchInput).toBeVisible();
        await expect(this.searchButton).toBeVisible();
    }

    async searchUsingSuggestion(searchText, suggestionText) {
        await this.searchInput.click();
        await this.searchInput.fill('');

        await this.searchInput.pressSequentially(searchText, {
            delay: 100
        });

        await this.page.waitForTimeout(4000);
        await this.searchInput.press('ArrowDown');

        const suggestion = this.page.locator(
            'a.ui-menu-item-wrapper'
        ).filter({
            hasText: suggestionText
        }).first();

        await expect(suggestion).toBeVisible({
            timeout: 10000
        });

        await suggestion.click();
    }

    async verifySearchResults(searchText) {
        await expect(
            this.page.getByText(`Results for "${searchText}"`, {
                exact: true
            })
        ).toBeVisible();

        await expect(this.downloadPdf.first()).toBeVisible();
    }

    async searchInvalidManual(searchText) {
        await this.searchInput.fill(searchText);
        await this.searchButton.click();
    }

    async verifyNoResults(searchText) {
        await expect(
            this.page.getByText(
                `No Results found for "${searchText}"`,
                { exact: true }
            )
        ).toBeVisible();

        await expect(
            this.page.getByText(
                /The product could not be found or information is not available/
            )
        ).toBeVisible();
    }

    async openPdfInNewTab() {
        const pdfTabPromise = this.page.waitForEvent('popup');

        await this.downloadPdf.first().click();

        const pdfTab = await pdfTabPromise;

        await expect(pdfTab).toHaveURL(
            /\.pdf(?:$|[?#])/i
        );

        await pdfTab.close();
    }

    async returnToMap() {
        await this.mapLink.click();

        await expect(
            this.page.getByText(
                /Quickly search and access NIPRO.*IFUs/
            )
        ).toBeVisible();
    }
}
