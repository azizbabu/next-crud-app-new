import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'common',
  initialState: {
    countryList: [],
    postList: [],
  },
  reducers: {
    setCountryList: (state, action) => {
      state.countryList = action.payload;
    },
    setPostList: (state, action) => {
      state.postList = action.payload;
    },
  },
});

export const { setCountryList, setPostList } = commonSlice.actions;

export default commonSlice.reducer;