// for local
import { createSlice } from '@reduxjs/toolkit';

// 초기상태 : null
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // set the user info(user _id, name, email, isAdmin not token) to local storage once authenticated
    // {_id: '66cd80ba77d59ce0799f4c73', name: 'John Doe', email: 'john@email.com', isAdmin: false}
    setCredentials: (state, action) => {
      state.userInfo = action.payload; // set user info state to the action.payload from the userApiSlice
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // clear the local storage
    logout: (state, action) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear();
      // localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
