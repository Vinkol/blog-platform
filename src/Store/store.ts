import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice';
import regReducer from './regSlice';
import { apiSlice } from '../api/apiSlice';

const store = configureStore({
  reducer: {
    articles: articlesReducer,
    reg: regReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;