import { test } from "@playwright/test";
import { LoginPage } from "../Pages/LoginPage";
import { CartPage } from "../Pages/CartPage";
import { Dashboard } from "../Pages/Dashboard";

const email = process.env.EMAIL ?? "";
const password = process.env.PASSWORD ?? "";

const products = {
  zara: "ZARA COAT 3",
  adidas: "ADIDAS ORIGINAL",
  iphone: "iphone 13 pro",
  invalid: "INVALID PRODUCT XYZ",
};

test.describe("Login", { tag: "@SmokeLogin" }, () => {
  test.describe.configure({ mode: "parallel" });

  test("invalid login should stay on login page", async ({ page }) => {
    const logObj = new LoginPage(page);
    await logObj.invalidLogin("wrong@email.com", "WrongPass123");
  });
});

test.describe("Dashboard", { tag: "@SmokeDashboard" }, () => {
  test.describe.configure({ mode: "parallel" });

  test.beforeEach(async ({ page }) => {
    if (!email || !password) {
      throw new Error("SET EMAIL AND PASSWORD inside the .env file");
    }

    const logObj = new LoginPage(page);
    await logObj.validLogin(email, password);
  });

  test.afterEach(async ({ page }) => {
    const logObj = new LoginPage(page);
    await logObj.logout();
  });

  test("list ZARA COAT 3 in dashboard", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.expectProduct(products.zara);
  });

  test("list ADIDAS ORIGINAL in dashboard", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.expectProduct(products.adidas);
  });

  test("list iphone 13 pro in dashboard", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.expectProduct(products.iphone);
  });
});

test.describe("Cart", { tag: "@regression" }, () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    if (!email || !password) {
      throw new Error("SET EMAIL AND PASSWORD inside the .env file");
    }

    const logObj = new LoginPage(page);
    await logObj.validLogin(email, password);
  });

  test.afterEach(async ({ page }) => {
    const logObj = new LoginPage(page);
    await logObj.logout();
  });

  test("cannot add a product that does not exist", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.expectCannotAddProduct(products.invalid);
  });

  test("Add ZARA COAT 3 to cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.addProduct(products.zara);
  });

  test("show zara coat 3 in cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    await dashboardObj.addProduct(products.zara);
    await dashboardObj.openCart();
    const cartObj = new CartPage(page);
    await cartObj.expectAddedProduct(products.zara);
  });

  test("remove zara coat 3 from cart", async ({ page }) => {
    const dashboardObj = new Dashboard(page);
    const cartObj = new CartPage(page);
    await dashboardObj.addProduct(products.zara);
    await dashboardObj.openCart();
    await cartObj.expectAddedProduct(products.zara);
    await cartObj.removeProductFromCart(products.zara);
  });

  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();

    const logObj = new LoginPage(page);
    const cartObj = new CartPage(page);
    const dashboardObj = new Dashboard(page);

    await logObj.validLogin(email, password);
    await dashboardObj.openCart();
    await cartObj.removeProductFromCart(products.zara);

    await page.close();
  });
});
