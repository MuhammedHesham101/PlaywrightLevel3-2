import { expect, type Locator, type Page } from "@playwright/test";

export class CartPage {

    constructor(private readonly page: Page) {
    }

  

    async expectAddedProduct(name: string) {
        await expect(this.page.locator(".cartSection h3").filter({ hasText: name }))
            .toBeVisible();
    }

    async removeProductFromCart(name: string) {
        const cartItems = this.page.locator(".cartWrap li");
        const row = cartItems.filter({ hasText: name });

        if ((await row.count()) === 0) return;

        const countBefore = await cartItems.count();
        await row.locator(".btn-danger").click();

        await expect(row).toHaveCount(0);
        await expect(cartItems).toHaveCount(countBefore - 1);
    }
}
