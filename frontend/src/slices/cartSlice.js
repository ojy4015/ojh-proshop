// createSlice : you would use for regular slices that aren't dealing with asynchronous request
import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// const addDecimals = (num) => {
//   return (Math.round(num * 100) / 100).toFixed(2);
// };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // reducers object will have any functions that have to do with the cart
  reducers: {
    addToCart: (state, action) => {
      // state : current state of the cart ( cartItems[] )
      // action.payload : sending an item to add to the cart
      // dispatch(addToCart({ ...product, qty })); from ProductScreen.jsx
      const item = action.payload; // 한가지 품목정보만 가짐

      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      // const { user, rating, numReviews, reviews, ...item } = action.payload;

      // console.log(
      //   ' user, rating, numReviews, reviews, ...item in addToCart : ',
      //   user,
      //   rating,
      //   numReviews,
      //   reviews,
      //   ...item
      // );

      //cartItems에 item의 _id와 같은 object
      const existItem = state.cartItems.find((x) => x._id === item._id);

      // payload is optional, any data that you want to send the redux in your action
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      // const { user, rating, numReviews, reviews, ...item } = action.payload;
      // const existItem = state.cartItems.find((x) => x._id === item._id);

      // 기존것을 새로운 것(item)으로 update
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        // 새로운 item을 cartItems에 더함
        state.cartItems = [...state.cartItems, item];
      }

      // console.log('state.cartItems : ', state.cartItems);

      // // Calculate items price
      // // cart에 있는 모든 항목의 총액
      // state.itemsPrice = addDecimals(
      //   state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      // );

      // // console.log('state.itemsPrice : ', state.itemsPrice);
      // // Calculate the shipping price (If order is over $100 then free, else $10 shipping)
      // state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

      // console.log('state.shippingPrice : ', state.shippingPrice);
      // // Calculate the tax price (15% tax)
      // state.taxPrice = addDecimals(
      //   Number((0.15 * state.itemsPrice).toFixed(2))
      // );
      // // console.log('state.taxPrice : ', state.taxPrice);

      // // Calculate the total price
      // state.totalPrice = (
      //   Number(state.itemsPrice) +
      //   Number(state.shippingPrice) +
      //   Number(state.taxPrice)
      // ).toFixed(2);

      // // console.log('state.totalPrice : ', state.totalPrice);

      // // Save cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice to localStorage
      // localStorage.setItem('cart', JSON.stringify(state));
      // return updateCart(state, item);
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      // action.payload is id
      // const removeFromCartHandler = (id) => {
      //   dispatch(removeFromCart(id));
      // };
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      // dispatch(saveShippingAddress({ address, city, postalCode, country })); from ShppingScreen.jsx
      state.shippingAddress = action.payload;
      // localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      // dispatch(savePaymentMethod(paymentMethod)); from PaymentScreen.jsx
      state.paymentMethod = action.payload;
      // localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      // localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
