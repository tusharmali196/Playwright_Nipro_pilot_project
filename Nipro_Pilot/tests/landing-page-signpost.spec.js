import { test, expect } from '@playwright/test';
import { NiproAdminPage } from '../pages/NiproAdminPage';
import { NiproLandingPage } from '../pages/NiproLandingPage';
import { NiproLandingPageLayout } from '../pages/NiproLandingPageLayout';

test(
    'Nipro Pilot Landing Page Signpost with Stats @smoke @regression',
    async ({ page }) => {
        const admin = new NiproAdminPage(page);
        const landing = new NiproLandingPage(page);
        const layout = new NiproLandingPageLayout(page);

        await admin.login(
            process.env.ADMIN_EMAIL,
            process.env.ADMIN_PASSWORD
        );

        await landing.openContent();
        await landing.openLandingPageForm();

        await landing.createLandingPage(
            'Signpost Landing Page'
        );

        await expect(
            page.getByText(
                'Signpost Landing Page',
                { exact: true }
            ).first()
        ).toBeVisible();

        await layout.openLayout();
        await layout.addOneColumnSection();

        // ONE Signpost component
        // THREE inner content blocks
        await layout.createAllThreeSignpostBlocks();

        // Add block -> Save Layout -> View
        await layout.saveLayoutAndView();

        // Verify all 3 cards on FE
        await layout.verifySignpostBlocksOnFrontend();
    }
);
