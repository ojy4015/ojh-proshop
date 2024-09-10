export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

// update state(itemsPrice, shippingPrice,taxPrice,totalPrice) of cartSlice
export const updateCart = (state) => {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate the shipping price
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate the tax price
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  // Calculate the total price
  state.totalPrice = addDecimals(totalPrice);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};

// export const updateCart = (state) => {
//   // Calculate items price
//   // cart에 있는 모든 항목의 총액
//   state.itemsPrice = addDecimals(
//     state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//   );

//   // console.log('state.itemsPrice : ', state.itemsPrice);
//   // Calculate the shipping price (If order is over $100 then free, else $10 shipping)
//   state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

//   console.log('state.shippingPrice : ', state.shippingPrice);
//   // Calculate the tax price (15% tax)
//   state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
//   // console.log('state.taxPrice : ', state.taxPrice);

//   // Calculate the total price
//   state.totalPrice = (
//     Number(state.itemsPrice) +
//     Number(state.shippingPrice) +
//     Number(state.taxPrice)
//   ).toFixed(2);

//   // console.log('state.totalPrice : ', state.totalPrice);

//   // Save cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice to localStorage
//   localStorage.setItem('cart', JSON.stringify(state));

//   return state;
// };
