// parent slice
// createApi : you would use for dealing with asynchronous request
// fetchBaseQuery : allow us to make request to our backend API
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

import { logout } from './authSlice'; // Import the logout action

// NOTE: code here has changed to handle when our JWT and Cookie expire.
// We need to customize the baseQuery to be able to intercept any 401 responses
// and log the user out
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  // Dispatch the logout action on 401.
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
}

export const apiSlice = createApi({
  // baseQuery,
  baseQuery: baseQueryWithAuth, // Use the customized baseQuery

  // tagTypes: used to define the types of data that will be fetching from API
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});

// slice is a collection of reducers and actions that are related to each other
