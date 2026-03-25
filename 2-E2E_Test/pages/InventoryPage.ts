import type { Locator, Page } from '@playwright/test';

/** Listado de productos tras el login. */
export class InventoryPage {
  constructor(private readonly page: Page) {}

  /** Contenedor del ítem cuyo texto incluye el nombre del producto. */
  private itemByProductName(productName: string): Locator {
    return this.page.locator('.inventory_item').filter({ hasText: productName });
  }

  /** Lee título y precio visibles en la tarjeta del producto. */
  async getProductTitleAndPrice(productName: string): Promise<{ title: string; price: string }> {
    const item = this.itemByProductName(productName);
    const title = (await item.locator('.inventory_item_name').innerText()).trim();
    const price = (await item.locator('.inventory_item_price').innerText()).trim();
    return { title, price };
  }

  /** Pulsa "Add to cart" dentro de la fila del producto. */
  async addToCart(productName: string): Promise<void> {
    const item = this.itemByProductName(productName);
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  /** Abre la vista del carrito (icono superior). */
  async openCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
  }
}
