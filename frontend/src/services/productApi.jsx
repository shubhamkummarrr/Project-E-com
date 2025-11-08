import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // READ (list)
    getProducts: builder.query({
      query: ({ search, ordering } = {}) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (ordering) params.set("ordering", ordering);
        const qs = params.toString();
        return `products/${qs ? `?${qs}` : ""}`;
      },
      providesTags: (result = [], error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product", id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // READ (one)
    getProduct: builder.query({
      query: (id) => `products/${id}/`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // CREATE
    createProduct: builder.mutation({
      query: (data) => ({
        url: `products/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // UPDATE (PUT/PATCH)
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `products/${id}/`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // DELETE
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
