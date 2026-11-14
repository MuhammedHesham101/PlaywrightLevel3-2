import { expect, type Locator, type Page } from "@playwright/test";

export class CartPage {
    private readonly cartBadge: Locator;

    constructor(private readonly page: Page) {
        this.cartBadge = page.locator("button[routerlink='/dashboard/cart'] label");
    }

    private async getCartBadgeCount(): Promise<number> {
        const text = ((await this.cartBadge.textContent()) ?? "").trim();
        return text === "" ? 0 : Number(text);
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
        const badgeBefore = await this.getCartBadgeCount();
        await row.locator(".btn-danger").click();

        await expect(row).toHaveCount(0);
        await expect(cartItems).toHaveCount(countBefore - 1);
        await expect.poll(async () => this.getCartBadgeCount()).toBe(badgeBefore - 1);
    }
}
