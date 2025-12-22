import type { ProductSelectType } from "$lib/types";

export class CartItem {
  product: ProductSelectType;
  quantity = $state(1);

  constructor(product: ProductSelectType) {
    this.product = product;
  }

  get unitPrice(): number {
    return Number(this.product.base_price || 0);
  }

  get subTotal(): number {
    return this.unitPrice * this.quantity;
  }

  increment() {
    this.quantity += 1;
  }

  decrement() {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  }
}

class Cart {
  items = $state<CartItem[]>([]);

  totalPrice = $derived.by(() => {
    return this.items.reduce((sum, item) => sum + item.subTotal, 0);
  });

  totalItemsCount = $derived.by(() => {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  });

  add(product: ProductSelectType) {
    const existingItem = this.findItem(product.id);

    if (existingItem) {
      existingItem.increment();
    } else {
      this.items.push(new CartItem(product));
    }
  }

  decrease(productId: string) {
    const item = this.findItem(productId);

    if (item) {
      item.decrement();
      if (item.quantity === 0) {
        this.removeItemCompletely(productId);
      }
    }
  }

  removeItemCompletely(productId: string) {
    this.items = this.items.filter((item) => item.product.id !== productId);
  }

  reset() {
    this.items = [];
  }

  private findItem(productId: string): CartItem | undefined {
    return this.items.find((item) => item.product.id === productId);
  }
}

export const globalCart = new Cart();