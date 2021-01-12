import { configureStore } from '@reduxjs/toolkit';
import messageReducer from '../features/messageSlice';


export default configureStore({
  reducer: {
    messages: messageReducer,
    
  },
});
