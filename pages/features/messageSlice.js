import { createSlice } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    msg1: null,
    msg2: null,
  },
  reducers: {
    setMsg1 : (state, action) => {
      state.msg1 = action.payload;
    },
    setMsg2 : (state, action) => {
        state.msg2 = action.payload;
      }
    
  },
});

export const { setMsg1, setMsg2 } = messageSlice.actions;

export const selectMsg1 = (state) => state.messages.msg1;
export const selectMsg2 = (state) => state.messages.msg2;

export default messageSlice.reducer;