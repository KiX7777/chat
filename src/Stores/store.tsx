import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './UserSlice';
import { ChatSlice } from './ChatSlice';

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    chat: ChatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
export type AppDispatch = typeof store.dispatch;
