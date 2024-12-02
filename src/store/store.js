import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import commonReducer from './commonSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    common: commonReducer
  },
});

export const selectPosts = (state) => state.posts.posList;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectCommon = (state) => state.common;