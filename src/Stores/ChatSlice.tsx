import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Message } from '../Components/Chat';

type ChatState = {
  chooseRoom: boolean;
  room: string;
  seeOnlineUsers: boolean;
  seeAllUsers: boolean;
  showConvos: boolean;
  roomMessages: Message[];
  roomUsers: string[];
  imageModal: boolean;
  modalImage: string;
};

const initialState: ChatState = {
  chooseRoom: false,
  room: '',
  seeOnlineUsers: false,
  seeAllUsers: false,
  showConvos: true,
  roomMessages: [],
  roomUsers: [],
  imageModal: false,
  modalImage: '',
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

    toggleModal(state) {
      state.imageModal = !state.imageModal;
    },

    closeModal(state) {
      state.imageModal = false;
    },

    setModalImage(state, action: PayloadAction<string>) {
      state.modalImage = action.payload;
    },

    setRoom(state, action) {
      state.room = action.payload;
    },
    setRoomUsers(state, action: PayloadAction<string[]>) {
      state.roomUsers = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.roomMessages = action.payload;
    },

    toggleShowConvos(state) {
      state.showConvos = !state.showConvos;
    },
    showConvos(state) {
      state.showConvos = true;
    },
    closeShowConvos(state) {
      state.showConvos = false;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const chatActions = ChatSlice.actions;
