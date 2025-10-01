import { Page } from '@playwright/test';
import { mobileCheck } from './device';

/**
 * @param page Playwright page instance/object
 * @param option Navbar main option
 * @param subOption Navbar sub option
 * @param hamburger Hamburger behavior, true if you want to interact (default), else false
 */
export async function navigate(
  page: Page,
  option:
    | 'Philippines'
    | 'Services'
    | 'Travel'
    | 'Government'
    | 'Flood Control Projects'
    | null = null,
  subOption: string | null = null,
  hamburger: boolean = true
): Promise<void> {
  const isMobile = await mobileCheck();

  // For mobile
  if (isMobile) {
    if (hamburger) {
      await page
        .getByRole('button', { name: 'Open main menu' })
        .first()
        .click();
    }

    if (option) {
      await page.getByRole('button', { name: option }).first().click();
    }

    if (subOption) {
      await page.getByRole('link', { name: subOption }).first().click();
    }
    return;
  }

  // For desktop
  if (option) {
    const linkElement = page
      .getByRole('link', { name: option, exact: true })
      .first();
    await linkElement.hover();
    // Wait for the dropdown to become visible after hover
    await page.waitForTimeout(300);

    // Wait for the dropdown menu to be visible if we have a subOption
    if (subOption) {
      // Wait for the specific menu item to be visible instead of the generic menu container
      await page.waitForSelector(`[role="menuitem"]:has-text("${subOption}")`, {
        state: 'visible',
        timeout: 5000,
      });
    }
  }

  if (subOption) {
    // Keep hovering over the parent link to maintain the dropdown
    if (option) {
      await page
        .getByRole('link', { name: option, exact: true })
        .first()
        .hover();
    }

    // Wait a moment for the menu to stabilize
    await page.waitForTimeout(100);

    // Click the menu item
    await page
      .getByRole('menuitem', { name: subOption, exact: true })
      .first()
      .click({ timeout: 10000 });
  }
}
