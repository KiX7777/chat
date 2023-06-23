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
  logOutRemove,
} from '../firebaseFunctions';
import { UserCardProps } from '../Components/UserFinder';
import { RootState } from './store';

export interface User {
  username: string;
  email: string;
  password: string;
  loggedIn: boolean;
  id: string;
  error: string;
  language: string;
}

const initialState: User = {
  username: '',
  email: '',
  password: '',
  loggedIn: false,
  id: '',
  error: '',
  language: 'hr',
};

export const login = createAsyncThunk(
  'user/login',
  async (user: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await emailLogin(user.email, user.password);
      if (typeof res === 'string') {
        //firebase sometimes fullfills request but it returns an error
        throw new Error(res);
      } else {
        localStorage.setItem('id', res.uid);
        setOnlineStatus(true, { ...user, id: res.uid });
        return { email: user.email, password: user.password, id: res.uid };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const state = thunkAPI.getState() as RootState;

      if (error.message === 'Firebase: Error (auth/wrong-password).') {
        return thunkAPI.rejectWithValue(
          state.user.language === 'en'
            ? 'Incorrect password'
            : 'Netočna lozinka'
        );
      } else if (error.message === 'Firebase: Error (auth/user-not-found).') {
        return thunkAPI.rejectWithValue(
          state.user.language === 'en'
            ? 'User not found.'
            : 'Korisnik nije pronađen'
        );
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
      //when creating a new account first check it there is an account with the selected username
      const existingUsers = await checkUsername();
      const state = thunkAPI.getState() as RootState;

      if (existingUsers.includes(user.username)) {
        return thunkAPI.rejectWithValue(
          state.user.language === 'en'
            ? 'Username taken'
            : 'Korisničko ime je zauzeto.'
        );
      } else {
        const res = await emailSignUp(user.email, user.password);
        if (typeof res === 'string') {
          throw new Error(res);
        } else {
          //set user's username to the one he entered
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
    } catch (err: unknown) {
      const error = err as Error;
      const state = thunkAPI.getState() as RootState;

      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        return thunkAPI.rejectWithValue(
          state.user.language === 'en'
            ? 'There is an account with that email.'
            : 'Već postoji račun s tom email adresom.'
        );
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const logout = createAsyncThunk(
  'user/logOut',
  async ({ room, user }: { room: string; user: User }, thunkAPI) => {
    try {
      await logOutRemove(room, user);
      await logOut();
      localStorage.delete('id');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const startIndChat = createAsyncThunk(
  'chat/start',
  async (
    {
      currentUser,
      user,
      combinedID,
    }: {
      currentUser: User;
      user: UserCardProps;
      combinedID: string | undefined;
    },
    thunkAPI
  ) => {
    try {
      await startIndividualChat(currentUser, user, combinedID);
    } catch (err: unknown) {
      const error = err as Error;
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
      currentuser: User;
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
    } catch (err) {
      const error = err as Error;
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
    setLanguage(state, action) {
      state.language = action.payload;
    },
  },
  extraReducers(builder) {
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

    builder.addCase(startIndChat.rejected, (state, action) => {
      state.error = action.payload as string;
    });
    builder.addCase(sendIndMessage.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const userActions = UserSlice.actions;
