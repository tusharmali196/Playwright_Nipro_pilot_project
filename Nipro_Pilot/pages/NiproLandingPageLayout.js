import { expect } from '@playwright/test';

export class NiproLandingPageLayout {
    constructor(page) {
        this.page = page;

        // =========================================================
        // Layout navigation
        // =========================================================

        this.layoutLink = page.getByRole('link', {
            name: 'Layout',
            exact: true
        });

        this.addSection = page
            .locator('a[href*="/layout_builder/choose/section/"]')
            .last();

        this.oneColumn = page
            .locator(
                'a[href*="/layout_builder/configure/section/"][href*="/layout_onecol"]'
            )
            .first();

        this.addSectionButton = page
            .locator('input[type="submit"][value="Add section"]')
            .last();

        // =========================================================
        // Layout Builder
        // =========================================================

        this.addBlock = page
            .locator(
                'div.layout-builder__add-block a.layout-builder__link--add'
            )
            .last();

        this.blockSearch = page.locator(
            'input.js-layout-builder-filter[placeholder="Filter by block name"]'
        );

        this.addBlockSubmit = page.locator(
            'input[type="submit"][value="Add block"]'
        );

        this.saveLayout = page.getByRole('button', {
            name: 'Save layout',
            exact: true
        });

        this.viewLink = page.getByRole('link', {
            name: 'View',
            exact: true
        });

        // =========================================================
        // News Listing Block
        // =========================================================

        this.newsListingBlock = page.getByRole('link', {
            name: 'News Listing Block',
            exact: true
        });

        this.displayTitle = page.locator(
            'input[data-drupal-selector^="edit-settings-label-display"]'
        );

        // =========================================================
        // Signpost With Stats
        // =========================================================

        this.signpostBlock = page.locator(
            'a[href*="layout_builder/add/block"][href*="nipro_signpost_with_stats"]'
        );
    }

    // =========================================================
    // Layout
    // =========================================================

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
        await expect(this.addSection).toBeVisible({
            timeout: 20000
        });

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

    // =========================================================
    // News Listing Block
    // =========================================================

    async addNewsListingBlock() {
        await expect(this.addBlock).toBeVisible({
            timeout: 20000
        });

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

        await expect(this.addBlockSubmit).toBeVisible({
            timeout: 20000
        });

        await this.addBlockSubmit.click();

        await expect(this.addBlock).toBeVisible({
            timeout: 20000
        });
    }

    // =========================================================
    // Add Signpost With Stats
    // =========================================================

    async addSignpostWithStats() {
    await expect(this.addBlock).toBeVisible({
        timeout: 20000
    });

    await this.addBlock.click();

    await expect(this.blockSearch).toBeVisible({
        timeout: 20000
    });

    await this.blockSearch.fill('Signpost');

    await expect(this.signpostBlock).toBeVisible({
        timeout: 20000
    });

    await this.signpostBlock.click();

    // Do NOT scope this to a dialog.
    // Drupal can render the inline-block selector as a page-level form.
    const createInlineBlock = this.page
        .locator(
            'button:has-text("Create inline block"), ' +
            'input[value="Create inline block"], ' +
            'a:has-text("Create inline block"), ' +
            '.form-submit[value="Create inline block"]'
        )
        .last();

    await expect(createInlineBlock).toBeVisible({
        timeout: 30000
    });

    await expect(createInlineBlock).toBeEnabled({
        timeout: 10000
    });

    await createInlineBlock.click();

    // Wait for the actual Signpost content form.
    await expect(
        this.page.getByRole('textbox', {
            name: 'Block description*',
            exact: true
        }).last()
    ).toBeVisible({
        timeout: 30000
    });
}
    // =========================================================
    // Fill current Signpost content block
    // =========================================================
async fillSignpostBlock(data) {
    const blockDescription = this.page.getByRole('textbox', {
        name: 'Block description*',
        exact: true
    }).last();

    const cardNumber = this.page.getByRole('textbox', {
        name: 'Card Number',
        exact: true
    }).last();

    const headline = this.page.getByRole('textbox', {
        name: 'Headline*',
        exact: true
    }).last();

    // Wait for main form fields
    await expect(blockDescription).toBeVisible({ timeout: 30000 });
    await expect(cardNumber).toBeVisible({ timeout: 30000 });
    await expect(headline).toBeVisible({ timeout: 30000 });

    // Fill normal fields
    await blockDescription.fill(data.blockDescription);
    await cardNumber.fill(String(data.cardNumber));
    await headline.fill(data.headline);

    // Description can appear as CKEditor or textarea during initialization
    const editor = this.page.locator(
        '.ck-editor__editable[contenteditable="true"]'
    ).last();

    const descriptionTextbox = this.page.getByRole('textbox', {
        name: 'Description',
        exact: true
    }).last();

    if (await editor.count() > 0) {
        await expect(editor).toBeVisible({ timeout: 30000 });
        await editor.fill(data.description);
    } else {
        await expect(descriptionTextbox).toBeVisible({ timeout: 30000 });
        await descriptionTextbox.fill(data.description);
    }

    // Full form is ready
    await expect(
        this.page.getByRole('button', {
            name: 'Add media',
            exact: true
        }).last()
    ).toBeVisible({ timeout: 30000 });

    await expect(
        this.page.getByRole('button', {
            name: 'Create content block',
            exact: true
        }).last()
    ).toBeVisible({ timeout: 30000 });
}

   async selectMedia() {
    // Open media library
    const addMediaButton = this.page
        .getByRole('button', {
            name: 'Add media',
            exact: true
        })
        .last();

    await expect(addMediaButton).toBeVisible({
        timeout: 20000
    });

    await addMediaButton.click();

    // Drupal Media Library modal
    const mediaModal = this.page.locator(
        '.media-library-widget-modal'
    ).last();

    await expect(mediaModal).toBeVisible({
        timeout: 20000
    });

    // Always select the FIRST media item
    const firstMedia = mediaModal
        .getByRole('checkbox')
        .first();

    await expect(firstMedia).toBeVisible({
        timeout: 20000
    });

    await firstMedia.check();

    // Insert selected
    const insertSelected = mediaModal.getByRole('button', {
        name: 'Insert selected',
        exact: true
    });

    await expect(insertSelected).toBeVisible({
        timeout: 20000
    });

    await expect(insertSelected).toBeEnabled({
        timeout: 10000
    });

    await insertSelected.click();

    // Wait for modal to close
    await expect(mediaModal).toBeHidden({
        timeout: 20000
    });
}
    // =========================================================
    // Create current content block
    // =========================================================

    async createContentBlock() {
    const createButton = this.page.getByRole('button', {
        name: 'Create content block',
        exact: true
    }).last();

    await expect(createButton).toBeVisible({
        timeout: 30000
    });

    await expect(createButton).toBeEnabled({
        timeout: 10000
    });

    await createButton.click();

    // Allow Drupal AJAX to finish before the next action.
    await this.page.waitForTimeout(5000);
}

async addNewSignpostContentBlock() {
    await this.page.waitForTimeout(2000);

    const addNewButton = this.page.getByRole('button', {
        name: 'Add new content block',
        exact: true
    });

    await expect(addNewButton).toBeVisible({
        timeout: 30000
    });

    await expect(addNewButton).toBeEnabled({
        timeout: 10000
    });

    await addNewButton.click();

    await expect(
        this.page.getByRole('textbox', {
            name: 'Block description*',
            exact: true
        }).last()
    ).toBeVisible({
        timeout: 30000
    });
}
    // =========================================================
    // Create all THREE Signpost content blocks
    // =========================================================

    async createAllThreeSignpostBlocks() {
    await this.addSignpostWithStats();

    const block1 = {
        blockDescription: 'First Signpost Block',
        cardNumber: '3',
        headline: 'First Signpost Headline',
        description: 'First Signpost description.'
    };

    const block2 = {
        blockDescription: 'Second Signpost Block',
        cardNumber: '3',
        headline: 'Second Signpost Headline',
        description: 'Second Signpost description.'
    };

    const block3 = {
        blockDescription: 'Third Signpost Block',
        cardNumber: '3',
        headline: 'Third Signpost Headline',
        description: 'Third Signpost description.'
    };

    // Block 1
    await this.fillSignpostBlock(block1);
    await this.selectMedia();
    await this.createContentBlock(block1);

    // Block 2
    await this.addNewSignpostContentBlock();
    await this.fillSignpostBlock(block2);
    await this.selectMedia();
    await this.createContentBlock(block2);

    // Block 3
    await this.addNewSignpostContentBlock();
    await this.fillSignpostBlock(block3);
    await this.selectMedia();
    await this.createContentBlock(block3);
}

    // =========================================================
    // Add Block -> Save Layout -> View
    // =========================================================

    async saveLayoutAndView() {
    // Final Add block
    const addBlockButton = this.page
        .getByRole('button', {
            name: 'Add block',
            exact: true
        })
        .last();

    await expect(addBlockButton).toBeVisible({
        timeout: 30000
    });

    await addBlockButton.click();

    // Click the page-level Save button directly
    await this.page.getByRole('button', {
        name: 'Save',
        exact: true
    }).click();

    // Open View
    await this.page.getByRole('link', {
        name: 'View',
        exact: true
    }).first().click();
}
    // =========================================================
    // Verify Signpost blocks on frontend
    // =========================================================

    async verifySignpostBlocksOnFrontend() {
        const expectedHeadlines = [
            'First Signpost Headline',
            'Second Signpost Headline',
            'Third Signpost Headline'
        ];

        for (const headline of expectedHeadlines) {
            await expect(
                this.page.getByText(headline, {
                    exact: true
                }).first()
            ).toBeVisible({
                timeout: 20000
            });
        }
    }

    // =========================================================
    // Anonymous News verification
    // =========================================================

    async verifyNewsBlockAsAnonymous() {
        const browser = this.page.context().browser();

        const anonymousContext = await browser.newContext();
        const anonymousPage = await anonymousContext.newPage();

        await anonymousPage.goto(this.page.url(), {
            waitUntil: 'domcontentloaded'
        });

        const newsTitle = anonymousPage
            .locator('.view.view-news .view-header')
            .filter({
                hasText: 'All News'
            })
            .first();

        await expect(newsTitle).toBeVisible({
            timeout: 20000
        });

        await anonymousContext.close();
    }
}
