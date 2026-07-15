import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "levantine-cart";

function saveCartToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full or unavailable */
  }
}

function recalculate(state) {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  saveCartToStorage(state.items);
}

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    cartOpen: false,
  },
  reducers: {
    initializeCart(state) {
      if (typeof window === "undefined") return;
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          state.items = JSON.parse(stored);
          recalculate(state);
        }
      } catch {
        /* ignore corrupt data */
      }
    },
    addToCart(state, action) {
      const { id, name, price, image, slug, stock } = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, stock);
      } else {
        state.items.push({ id, name, price, image, slug, stock, quantity: 1 });
      }

      recalculate(state);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      recalculate(state);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }

      recalculate(state);
    },
    clearCart(state) {
      state.items = [];
      recalculate(state);
    },
    setCartOpen(state, action) {
      state.cartOpen = action.payload;
    },
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
} = cartSlice.actions;
export default cartSlice.reducer;
