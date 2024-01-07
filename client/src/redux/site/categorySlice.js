import { createSlice } from '@reduxjs/toolkit'

const categorySlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {
    addCategory: (state, action) => {
       state.push(action.payload); 
    },

    removeCategory: (state, action) => {
      const indexToRemove = state.indexOf(action.payload);
      if (indexToRemove !== -1) {
        state.splice(indexToRemove, 1);
      }
    },
  }
})

export const { addCategory, removeCategory } = categorySlice.actions;
export default categorySlice.reducer;