import { createSlice } from '@reduxjs/toolkit';

// Helper to round numbers to 2 decimal places
const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Helper to recalculate prices
export const updateCartPrices = (state) => {
  // Calculate items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate shipping price (Free if subtotal is over $100, else $10)
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate tax price (15% tax)
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // Calculate total price
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  state.totalPrice = addDecimals(totalPrice);

  // Save state to localStorage
  localStorage.setItem('cart', JSON.stringify(state));
};

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'Cash on Delivery',
      itemsPrice: '0.00',
      shippingPrice: '0.00',
      taxPrice: '0.00',
      totalPrice: '0.00',
    };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      updateCartPrices(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      updateCartPrices(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = '0.00';
      state.shippingPrice = '0.00';
      state.taxPrice = '0.00';
      state.totalPrice = '0.00';
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
