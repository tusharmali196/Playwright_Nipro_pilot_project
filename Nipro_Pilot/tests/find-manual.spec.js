import { test } from '@playwright/test';
import { NiproFindManualPage } from '../pages/NiproFindManualPage.js';

test.describe('Find a Manual', () => {

    test('User can navigate to United Kingdom manuals', async ({ page }) => {
        const manualPage = new NiproFindManualPage(page);

        await manualPage.gotoHome();
        await manualPage.openUnitedKingdomManuals();
    });

    test('User can search manuals using autocomplete', async ({ page }) => {
        const manualPage = new NiproFindManualPage(page);

        await manualPage.gotoHome();
        await manualPage.openUnitedKingdomManuals();

        await manualPage.searchUsingSuggestion(
            'need',
            'Safe Touch Needle'
        );

        await manualPage.verifySearchResults('Safe Touch Needle');
    });

    test('User sees an error for an invalid manual search', async ({ page }) => {
        const manualPage = new NiproFindManualPage(page);

        await manualPage.gotoHome();
        await manualPage.openUnitedKingdomManuals();

        await manualPage.searchInvalidManual('safsafsafsaf');

        await manualPage.verifyNoResults('safsafsafsaf');
    });

    test('User can open a manual PDF in a new tab', async ({ page }) => {
        const manualPage = new NiproFindManualPage(page);

        await manualPage.gotoHome();
        await manualPage.openUnitedKingdomManuals();

        await manualPage.openPdfInNewTab();
    });

    test('User can return to the IFU map from the footer', async ({ page }) => {
        const manualPage = new NiproFindManualPage(page);

        await manualPage.gotoHome();
        await manualPage.openUnitedKingdomManuals();

        await manualPage.returnToMap();
    });

});
