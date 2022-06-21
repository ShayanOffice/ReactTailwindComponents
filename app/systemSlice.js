import { createSlice } from '@reduxjs/toolkit';

const systemSlice = createSlice({
  name: 'system',
  initialState: {
    status: {
      isLoading: false,
    },
  },

  reducers: {
    setIsLoading: (state, { payload }) => {
      state.status.isLoading = payload;
    },
  },
});

export const { setIsLoading } = systemSlice.actions;
export default systemSlice.reducer;
