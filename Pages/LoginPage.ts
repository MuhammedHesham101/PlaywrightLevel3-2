import { expect , type Locator , type Page } from "@playwright/test";

export class LoginPage {
    private readonly email:Locator ; 
    private readonly password:Locator;
    private readonly loginButton:Locator; 
    private readonly signOutButton:Locator;

    constructor(private readonly page:Page){
        this.email = page.locator('#userEmail');
        this.password = page.locator('#userPassword')
        this.loginButton = page.locator("#login");
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
    }

    async validLogin(email:string , password:string){
        await this.page.goto(process.env.BASE_URL ?? "");
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        await expect(this.signOutButton).toBeVisible();
    }

    async invalidLogin(email:string , password:string){
        await this.page.goto(process.env.BASE_URL ?? "");
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        await expect(this.email).toBeVisible();
    }

    async logout(){
        await this.signOutButton.click();
        await expect(this.email).toBeVisible();
    }
}
