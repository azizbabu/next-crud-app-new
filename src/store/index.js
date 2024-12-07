// import { configureStore } from '@reduxjs/toolkit';
import { createStore } from 'redux';
import postsReducer from './postsSlice';
import commonReducer from './commonSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  // This uses localStorage in the browser
import { combineReducers } from 'redux';

// export const store = configureStore({
//   reducer: {
//     posts: postsReducer,
//     common: commonReducer
//   },
// });

// Combine the reducers
const rootReducer = combineReducers({
  posts: postsReducer,
  common: commonReducer
});

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage, // This is where Redux Persist stores the data (localStorage by default)
  whitelist: ['posts', 'common'], // Persist only the posts and common state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = createStore(persistedReducer);

// Create persistor for syncing with storage
const persistor = persistStore(store);

export { store, persistor };


export const selectPosts = (state) => state.posts.postList;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectCommon = (state) => state.common;