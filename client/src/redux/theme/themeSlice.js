import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  isLight: false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      state.isLight = state.theme === 'dark';
    }
  }
})

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;