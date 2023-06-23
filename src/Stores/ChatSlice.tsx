import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chooseRoom: false,
  room: '',
  seeOnlineUsers: false,
  seeAllUsers: false,
  showConvos: true,
  roomMessages: [],
  roomUsers: [],
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    closeFindOptions(state) {
      state.seeAllUsers = false;
    },
    toggleFindOptions(state) {
      state.seeAllUsers = !state.seeAllUsers;
    },
    closeChooseRoom(state) {
      state.chooseRoom = false;
    },
    showChooseRoomBtn(state) {
      state.chooseRoom = true;
    },
    setRoom(state, action) {
      state.room = action.payload;
    },
    setRoomUsers(state, action) {
      state.roomUsers = action.payload;
    },
    setMessages(state, action) {
      state.roomMessages = action.payload;
    },

    toggleShowConvos(state) {
      state.showConvos = !state.showConvos;
    },
    closeShowConvos(state) {
      state.showConvos = false;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const chatActions = ChatSlice.actions;
