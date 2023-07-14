import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtil";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;

      const existing = state.cartItems.find((x) => x._id === item._id);
      if (existing) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existing._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
      //state = updateCart(state)
    },

    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      return updateCart(state);
    },

    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems(state, action) {
      state.cartItems = [];
      return updateCart(state);
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
