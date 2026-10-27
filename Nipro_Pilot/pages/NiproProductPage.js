import { expect } from '@playwright/test';

export class NiproProductPage {
    constructor(page) {
        this.page = page;

        this.productName = page.locator('[data-drupal-selector="edit-title-0-value"]');

        this.division = page.locator('[data-drupal-selector="edit-field-business-term"]');

        this.businessUnit = page.locator('[data-drupal-selector="edit-field-expertise"]');

        this.productCategory = page.locator('[data-drupal-selector^="edit-field-product-category-"][data-drupal-selector$="-target-id"]');

        this.addProductCategory = page.locator('[data-drupal-selector="edit-field-product-category-add-more"]');

        this.country = page.locator('[data-drupal-selector^="edit-field-country-"][data-drupal-selector$="-target-id"]');

        this.addCountry = page.locator('[data-drupal-selector="edit-field-country-add-more"]');

        this.productDescription = page.locator('xpath=//label[normalize-space()="Product Description"]/following::div[@contenteditable="true"][1]');

        this.protectedSetting = page.locator('[data-drupal-selector="edit-protected-value"]');

        this.moderationState = page.locator('[data-drupal-selector="edit-moderation-state-0-state"]');

        this.saveButton = page.locator('[data-drupal-selector="gin-sticky-edit-submit"]');
    }

    async gotoCreateProduct() {
        await this.page.goto( `${process.env.NIPRO_BASE_URL}/node/add/product` );

        await expect(this.productName).toBeVisible({
            timeout: 30000
        });
    }

    async fillMandatoryFields() {
        await this.productName.fill('Automation Test Product');

        await this.division.selectOption({ label: 'Medical Devices'});

        await this.page.waitForTimeout(3000);

        await this.businessUnit.selectOption({ label: 'Renal Care' });

        const firstCategory = this.productCategory.nth(0);

        await firstCategory.fill('Acc');

        await expect(this.page.getByText('Accessories', { exact: true }).last()).toBeVisible({
            timeout: 15000
        });

        await this.page.getByText('Accessories', { exact: true }).last().click();

        await this.addProductCategory.click();

        const secondCategory = this.productCategory.nth(1);

        await secondCategory.fill('Dia');

        await expect(this.page.getByText('Diagnostic', { exact: true }).last()).toBeVisible({
            timeout: 15000
        });

        await this.page.getByText('Diagnostic',{ exact: true }).last().click();

        const firstCountry = this.country.nth(0);

        await firstCountry.fill('Glo');

        await expect(this.page.getByText('Global', { exact: true }).last()).toBeVisible();

        await this.page.getByText('Global',{ exact: true }).last().click();

        await expect(firstCountry).toHaveValue(/Global/);

        await this.addCountry.click();

        const secondCountry = this.country.nth(1);

        await expect(secondCountry).toBeVisible();

        await secondCountry.fill('Ind');

        await expect(this.page.getByText('India', { exact: true }).last()).toBeVisible();

        await this.page.getByText('India', { exact: true }).last().click();

        await expect(secondCountry).toHaveValue(/India/);

        await this.productDescription.fill('Automation test product description1.');
    }

    async enableProtectedSetting() {
        if (!(await this.protectedSetting.isChecked())) {
            await this.protectedSetting.check();
        }
    }

    async publishAndSave() {
        await this.moderationState.selectOption({ label: 'Published' });

        await this.saveButton.click();

        await this.page.waitForLoadState('domcontentloaded');
    }

     async getCurrentNodeUrl() {
        return this.page.url();
    }

    async checkLoginBlock(nodeUrl) {
        const browser = this.page.context().browser();

        const anonymousContext = await browser.newContext();
        const publicPage = await anonymousContext.newPage();

        await publicPage.goto(nodeUrl);

        await expect( publicPage.getByText('Continue Reading', { exact: true })).toBeVisible({
            timeout: 15000
        });

        await expect( publicPage.getByRole('link', { name: 'Login' })).toBeVisible({
            timeout: 15000
        });

        await anonymousContext.close();
    }
}
