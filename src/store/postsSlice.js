// A Redux slice handles actions and reducers for the posts list. 
// This slice will manage the list of posts (posList), which you can fetch, add, update, or delete.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Initial state for posts
const initialState = {
  postList: [],
  loading: false,
  error: null,
};

// Async thunk for fetching posts from the API
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (paginationParams, { rejectWithValue }) => {
    try {
      const { page, pageSize } = paginationParams;
      const response = await axios.get(`${API_BASE_URL}/posts/list`, {
        params: { page, pageSize },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create the slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.postList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.posList.push(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posList.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posList[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posList = state.posList.filter(post => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posList = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
      });
  },
});

// Export actions to be used in components
export const { setPosts, setLoading, setError, addPost, updatePost, deletePost } = postsSlice.actions;

// Export the reducer to be included in the store
export default postsSlice.reducer;