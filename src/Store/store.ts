import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from '../api/apiSlice'

import articlesReducer from './articlesSlice'
import regReducer from './regSlice'

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    reg: regReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export default store
