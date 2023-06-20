/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-refresh/only-export-components */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  emailLogin,
  emailSignUp,
  updateUsername,
  createUser,
  logOut,
  checkUsername,
  setOnlineStatus,
  startIndividualChat,
  sendIndividualMessage,
} from '../firebaseFunctions';
import { User as UserType } from 'firebase/auth';
import { UserCardProps } from '../Components/UserFinder';

export interface User {
  username: string;
  email: string;
  password: string;
  loggedIn: boolean;
  id: string;
  error: string;
}

const initialState: User = {
  username: '',
  email: '',
  password: '',
  loggedIn: false,
  id: '',
  error: '',
};

export const login = createAsyncThunk(
  'user/login',
  async (user: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await emailLogin(user.email, user.password);
      console.log(res);
      if (typeof res === 'string') {
        console.log('first');
        throw new Error(res);
        return;
      } else {
        localStorage.setItem('id', res.uid);
        setOnlineStatus(true, { ...user, id: res.uid });
        return { email: user.email, password: user.password, id: res.uid };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/wrong-password).') {
        return thunkAPI.rejectWithValue('Incorrect password');
      } else if (error.message === 'Firebase: Error (auth/user-not-found).') {
        return thunkAPI.rejectWithValue('User not found.');
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const signUp = createAsyncThunk(
  'user/signUp',
  async (
    user: {
      email: string;
      password: string;
      username: string;
    },
    thunkAPI
  ) => {
    try {
      const existingUsers = await checkUsername();
      console.log(existingUsers);
      if (existingUsers.includes(user.username)) {
        return thunkAPI.rejectWithValue('Username taken');

        // throw new Error('Username taken')
      } else {
        console.log(user.username);
        const res = await emailSignUp(user.email, user.password);
        console.log(res);
        if (typeof res === 'string') {
          throw new Error(res);
        } else {
          updateUsername(user.username);
          createUser({ username: user.username, id: res.uid, online: true });
          localStorage.setItem('id', res.uid);

          return {
            email: user.email,
            password: user.password,
            username: user.username,
            id: res.uid,
          };
        }
      }
    } catch (error: any) {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        return thunkAPI.rejectWithValue('There is an account with that email.');
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const logout = createAsyncThunk('user/logOut', async (_, thunkAPI) => {
  try {
    await logOut();
    localStorage.delete('id');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    thunkAPI.rejectWithValue(error.message);
  }
});

export const startIndChat = createAsyncThunk(
  'chat/start',
  async (
    {
      currentUser,
      user,
      combinedID,
    }: {
      currentUser: any;
      user: UserCardProps;
      combinedID: string | undefined;
    },
    thunkAPI
  ) => {
    try {
      await startIndividualChat(currentUser, user, combinedID);
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendIndMessage = createAsyncThunk(
  'chat/send',
  async (
    {
      currentuser,
      receiverID,
      combinedID,
      inputMsg,
    }: {
      currentuser: any;
      receiverID: string | undefined;
      combinedID: string | undefined;
      inputMsg: string;
    },
    thunkAPI
  ) => {
    try {
      await sendIndividualMessage(
        currentuser,
        receiverID,
        combinedID,
        inputMsg
      );
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.loggedIn = !!action.payload.username;
      state.id = action.payload.id;
      if (action.payload.id) {
        state.loggedIn = true;
      }
    },
  },
  extraReducers(builder) {
    // builder.addCase(login.pending, (state) => {
    //   state.
    // })
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload!.id) {
        state.email = action.payload!.email;
        state.id = action.payload!.id;
        state.loggedIn = true;
        state.password = action.payload!.password;
        state.error = '';
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    builder.addCase(signUp.fulfilled, (state, action) => {
      if (action.payload) {
        state.email = action.payload!.email;
        state.username = action.payload!.username;
        state.password = action.payload!.password;
        state.loggedIn = true;
        state.id = action.payload!.id;
        state.error = '';
      }
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loggedIn = false;
      state.email = '';
      state.username = '';
      state.password = '';
      state.id = '';
    });
    // builder.addCase(startIndChat.pending, (state) => {

    // });
    // builder.addCase(startIndChat.fulfilled, (state) => {});
    builder.addCase(startIndChat.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(sendIndMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    // builder.addCase(signUp.rejected, (state) => {})
    // builder.addCase(login.rejected, (state) => {})
  },
});

export const userActions = UserSlice.actions;
