import { createApi } from '@reduxjs/toolkit/query/react'

import { Article, NewArticle, ArticlesResponse } from '../types/types'

import baseQuery from './api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Article', 'User'],
  endpoints: (builder) => ({
    getArticles: builder.query<ArticlesResponse, { limit?: number; offset?: number } | void>({
      query: ({ limit = 10, offset = 0 } = {}) => `/articles?limit=${limit}&offset=${offset}`,
      providesTags: (result) =>
        result?.articles
          ? [
              ...result.articles.map(({ slug }) => ({ type: 'Article' as const, id: slug })),
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),

    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `/articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),

    createArticle: builder.mutation<Article, NewArticle>({
      query: (newArticle) => ({
        url: '/articles',
        method: 'POST',
        body: { article: newArticle },
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),

    updateArticle: builder.mutation<Article, { slug: string; updatedArticle: NewArticle }>({
      query: ({ slug, updatedArticle }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: { article: updatedArticle },
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'Article', id: result.slug },
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),

    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, slug) => [
        { type: 'Article', id: slug },
        { type: 'Article', id: 'LIST' },
      ],
    }),

    toggleLike: builder.mutation<void, { slug: string; isLiked: boolean }>({
      query: ({ slug, isLiked }) => ({
        url: `/articles/${slug}/favorite`,
        method: isLiked ? 'DELETE' : 'POST',
      }),
      invalidatesTags: (_, __, { slug }) => [
        { type: 'Article', id: slug },
        { type: 'Article', id: 'LIST' },
      ],
    }),

    createUser: builder.mutation<Article, { email: string; password: string; username: string }>({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: { user: newUser },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    loginUser: builder.mutation<Article, { email: string; password: string }>({
      query: (userCredentials) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: userCredentials },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<Article, { email?: string; username?: string; image?: string }>({
      query: (updatedUser) => ({
        url: '/user',
        method: 'PUT',
        body: { user: updatedUser },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getUser: builder.query<Article, void>({
      query: () => '/user',
      providesTags: ['User'],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useToggleLikeMutation,
  useCreateUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} = apiSlice
