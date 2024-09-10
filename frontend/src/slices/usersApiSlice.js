import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

// for server communicating frontend
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      // email and password is data
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data,
      }),
    }),
    register: builder.mutation({
      // name, email and password is data
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: ({ pageNumber }) => ({
        url: USERS_URL,
        params: {
          pageNumber,
        },
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5, // 5 second
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      // await updateUser({ userId, name, email, isAdmin }); from UserEditScreen
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = userApiSlice;
