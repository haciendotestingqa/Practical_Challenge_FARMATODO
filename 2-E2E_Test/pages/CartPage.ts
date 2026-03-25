import type { Page } from '@playwright/test';

/** Página del carrito: líneas añadidas y botón para ir al checkout. */
export class CartPage {
  constructor(private readonly page: Page) {}

  /** Título y precio de la primera línea (en este flujo solo hay un producto). */
  async getLineTitleAndPrice(): Promise<{ title: string; price: string }> {
    const row = this.page.locator('.cart_item').first();
    const title = (await row.locator('.inventory_item_name').innerText()).trim();
    const price = (await row.locator('.inventory_item_price').innerText()).trim();
    return { title, price };
  }

  /** Continúa al formulario de datos de envío / checkout. */
  async checkout(): Promise<void> {
    await this.page.locator('[data-test="checkout"]').click();
  }
}
