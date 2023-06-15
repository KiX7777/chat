import { configureStore } from '@reduxjs/toolkit'
import { UserSlice } from './UserSlice'

const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store
export type AppDispatch = typeof store.dispatch
