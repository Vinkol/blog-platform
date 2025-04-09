import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Article {
  slug: string;
  title: string;
  body: string;
}

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: ArticlesState = {
  articles: [],
  loading: false,
  error: null,
  currentPage: 1,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    fetchArticlesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchArticlesSuccess(state, action: PayloadAction<Article[]>) {
      state.articles = action.payload;
      state.loading = false;
    },
    fetchArticlesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  fetchArticlesStart,
  fetchArticlesSuccess,
  fetchArticlesFailure,
  setCurrentPage,
} = articlesSlice.actions;

export default articlesSlice.reducer;