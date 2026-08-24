import { expect } from '@playwright/test';

export class NiproLandingPageLayout {
    constructor(page) {
        this.page = page;

        this.layoutLink = page.getByRole('link', {
            name: 'Layout',
            exact: true
        });

        this.addSection = page.locator('a[href*="/layout_builder/choose/section/"]').last();

        this.oneColumn = page.locator('a[href*="/layout_builder/configure/section/"][href*="/layout_onecol"]').first();

        this.addSectionButton = page.locator('input[type="submit"][value="Add section"]').last();

        this.addBlock = page.locator('div.layout-builder__add-block a.layout-builder__link--add').last();

        this.blockSearch = page.locator('input.js-layout-builder-filter[placeholder="Filter by block name"]');

        this.newsListingBlock = page.getByRole('link', {
            name: 'News Listing Block',
            exact: true
        });

        this.displayTitle = page.locator('input[data-drupal-selector^="edit-settings-label-display"]');

        this.addBlockSubmit = page.locator('input[type="submit"][value="Add block"]');

        this.saveLayout = page.getByRole('button', {
             name: 'Save layout',
             exact: true
        });

        this.viewLink = page.getByRole('link', {
            name: 'View',
            exact: true
        });

        this.newsTitle = page.getByText('All News', { exact: true }).first();
    }

    async openLayout() {
        await expect(this.layoutLink).toBeVisible({
            timeout: 20000
        });

        await this.layoutLink.click();

        await expect(this.addSection).toBeVisible({
            timeout: 20000
        });
    }

    async addOneColumnSection() {
        await this.addSection.click();

        await expect(this.oneColumn).toBeVisible({
            timeout: 20000
        });

        await this.oneColumn.click();

        await expect(this.addSectionButton).toBeVisible({
            timeout: 20000
        });

        await this.addSectionButton.click();

        await expect(this.addBlock).toBeVisible({
            timeout: 20000
        });
    }

    async addNewsListingBlock() {
        await this.addBlock.click();

        await expect(this.blockSearch).toBeVisible({
            timeout: 20000
        });

        await this.blockSearch.fill('news');

        await expect(this.newsListingBlock).toBeVisible({
            timeout: 20000
        });

        await this.newsListingBlock.click();

        if (await this.displayTitle.isChecked()) {
            await this.displayTitle.uncheck();
        }

        await this.addBlockSubmit.click();

        await expect(this.addBlock).toBeVisible({
            timeout: 20000
        });
    }


    async saveLayoutAndView() {
        await this.saveLayout.click();

        await expect(this.viewLink).toBeVisible({
            timeout: 20000
        });

        await this.viewLink.click();

        await expect(this.newsTitle).toBeVisible({
            timeout: 20000
        });
    }

    async verifyNewsBlockAsAnonymous() {

    const browser = this.page.context().browser();
    const anonymousContext = await browser.newContext();
    const anonymousPage = await anonymousContext.newPage();

        await anonymousPage.goto(this.page.url(), {
        waitUntil: 'domcontentloaded'
    });

    const newsTitle = anonymousPage.locator('.view.view-news .view-header').filter({ hasText: 'All News' }).first();

        await expect(newsTitle).toBeVisible({
        timeout: 20000
    });

        await anonymousContext.close();
    }
}
