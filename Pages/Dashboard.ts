import { expect , type Locator , type Page } from "@playwright/test";

export class Dashboard {

    private readonly cards: Locator;
    private readonly cartLink: Locator;


    constructor(private readonly page: Page) {
        this.cards = page.locator(".card-body");
        this.cartLink = page.locator("button[routerlink='/dashboard/cart']");
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

    async openCart() {
        await this.cartLink.click();
    }

}
