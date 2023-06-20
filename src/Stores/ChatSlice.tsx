import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chooseRoom: false,
  room: '',
  seeOnlineUsers: false,
  seeAllUsers: false,
  showConvos: true,
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

    toggleShowConvos(state) {
      state.showConvos = !state.showConvos;
    },
    closeShowConvos(state) {
      state.showConvos = false;
    },
  },
});

export const chatActions = ChatSlice.actions;
