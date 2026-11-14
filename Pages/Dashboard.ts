import { expect , type Locator , type Page } from "@playwright/test";

export class Dashboard {

    private readonly cards: Locator;
    private readonly cartLink: Locator;
    private readonly cartBadge: Locator;


    constructor(private readonly page: Page) {
        this.cards = page.locator(".card-body");
        this.cartLink = page.locator("button[routerlink='/dashboard/cart']");
        this.cartBadge = this.cartLink.locator("label");
    }


    async expectProduct(name :string){
        await expect(this.cards.filter({ hasText: name})).toBeVisible();
    }


    async addProduct(productName :string){
        await this.cards.filter({ hasText : productName })
        .getByRole('button').filter({ hasText: 'Add To Cart' })
        .click();
        await expect( this.page.locator('#toast-container')).toBeVisible();
    }

    async expectCannotAddProduct(productName: string) {
        await expect(
            this.cards
                .filter({ hasText: productName })
                .getByRole("button")
                .filter({ hasText: "Add To Cart" })
        ).toHaveCount(0);
    }

    async getCartCount(): Promise<number> {
        const text = ((await this.cartBadge.textContent()) ?? "").trim();
        return text === "" ? 0 : Number(text);
    }

    async expectCartCount(count: number) {
        await expect.poll(async () => this.getCartCount()).toBe(count);
    }

    async openCart() {
        await this.cartLink.click();
    }

}
