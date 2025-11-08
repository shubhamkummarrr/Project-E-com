// src/services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserToken, unSetUserToken } from "../features/authSlice";

// ✅ Base query with automatic token attach
const baseQuery = fetchBaseQuery({
  baseUrl: "http://127.0.0.1:8000/api/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// ✅ Wrapper for token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "user/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          localStorage.setItem("access_token", refreshResult.data.access);
          api.dispatch(
            setUserToken({
              access_token: refreshResult.data.access,
              refresh_token: refreshToken,
            })
          );
          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          api.dispatch(unSetUserToken());
        }
      } catch (error) {
        console.error("Error refreshing token", error);
      }
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      api.dispatch(unSetUserToken());
    }
  }

  return result;
};

// ✅ Unified API (User + Product)
export const userAuthApi = createApi({
  reducerPath: "mainApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "User"],
  endpoints: (builder) => ({
    // ---------------------- USER AUTH ----------------------
    registerUser: builder.mutation({
      query: (user) => ({
        url: "user/register/",
        method: "POST",
        body: user,
      }),
    }),

    loginUser: builder.mutation({
      query: (user) => ({
        url: "user/login/",
        method: "POST",
        body: user,
      }),
    }),

    getLoggedUser: builder.query({
      query: () => ({
        url: "user/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    changeUserPassword: builder.mutation({
      query: (actualData) => ({
        url: "user/changepassword/",
        method: "POST",
        body: actualData,
      }),
    }),

    sendPasswordResetEmail: builder.mutation({
      query: (user) => ({
        url: "user/send-reset-password-email/",
        method: "POST",
        body: user,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => ({
        url: `user/reset-password/${id}/${token}/`,
        method: "POST",
        body: actualData,
      }),
    }),

    // ---------------------- PRODUCT CRUD ----------------------
    getProducts: builder.query({
      query: ({ search, ordering } = {}) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (ordering) params.set("ordering", ordering);
        const qs = params.toString();
        return `products/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result = []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getProduct: builder.query({
      query: (id) => `products/${id}/`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "products/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

// ✅ Auto-generated hooks
export const {
  // User
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  // Product
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = userAuthApi;
