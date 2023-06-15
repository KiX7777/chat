import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  emailLogin,
  emailSignUp,
  updateUsername,
  createUser,
  logOut,
  checkUsername,
} from '../firebaseFunctions'

interface Initial {
  username: string
  email: string
  password: string
  loggedIn: boolean
  id: string
}

const initialState: Initial = {
  username: '',
  email: '',
  password: '',
  loggedIn: false,
  id: '',
}

export const login = createAsyncThunk(
  'user/login',
  async (
    user: {
      email: string
      password: string
    },
    thunkAPI
  ) => {
    try {
      const res = await emailLogin(user.email, user.password)
      console.log(res)
      if (typeof res === 'string') {
        console.log('first')
        throw new Error(res)
        return
      } else {
        localStorage.setItem('id', res.uid)
        return { email: user.email, password: user.password, id: res.uid }
      }
    } catch (error: any) {
      return error.message
    }
  }
)

export const signUp = createAsyncThunk(
  'user/signUp',
  async (
    user: {
      email: string
      password: string
      username: string
    },
    thunkAPI
  ) => {
    try {
      const existingUsers = await checkUsername()
      console.log(existingUsers)
      if (existingUsers.includes(user.username)) {
        alert('Username taken')
        thunkAPI.rejectWithValue('Username taken')

        // throw new Error('Username taken')

        return
      } else {
        console.log(user.username)
        const res = await emailSignUp(user.email, user.password)
        console.log(res)
        if (typeof res === 'string') {
          throw new Error(res)
        } else {
          updateUsername(user.username)
          createUser({ username: user.username, id: res.uid })
          localStorage.setItem('id', res.uid)

          return {
            email: user.email,
            password: user.password,
            username: user.username,
            id: res.uid,
          }
        }
      }
    } catch (error) {
      thunkAPI.rejectWithValue(error)
    }
  }
)

export const logout = createAsyncThunk('user/logOut', async (_, thunkAPI) => {
  try {
    await logOut()
    localStorage.delete('id')
  } catch (error) {
    thunkAPI.rejectWithValue(error.message)
  }
})

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.email = action.payload.email
      state.username = action.payload.username
      state.loggedIn = !!action.payload.username
      state.id = action.payload.id
      if (action.payload.id) {
        state.loggedIn = true
      }
    },
  },
  extraReducers(builder) {
    // builder.addCase(login.pending, (state) => {
    //   state.
    // })
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload.id) {
        state.email = action.payload.email
        state.id = action.payload.id
        state.loggedIn = true
        state.password = action.payload.password
      }
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      if (action.payload) {
        state.email = action.payload!.email
        state.username = action.payload!.username
        state.password = action.payload!.password
        state.loggedIn = true
        state.id = action.payload!.id
      }
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loggedIn = false
      state.email = ''
      state.username = ''
      state.password = ''
      state.id = ''
    })
    // builder.addCase(signUp.rejected, (state) => {})
    // builder.addCase(login.rejected, (state) => {})
  },
})

export const userActions = UserSlice.actions
