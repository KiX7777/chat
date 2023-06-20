import React from 'react';
import classes from './IndiviudalChat.module.css';
import { useAppSelector } from '../hooks';
interface ChatInfo {
  users: string[];
}

const IndividualChat = ({ chat }: { chat: ChatInfo }) => {
  const currentUser = useAppSelector((state) => state.user);
  const otherUser = chat.users
    .slice()
    .filter((u) => u !== currentUser.username);
  return (
    <div className={classes.chatContainer}>
      <button>BACK</button>
      <h1>{otherUser}</h1>
      <h2>TEst</h2>
      IndividualChat
      <div className={classes.messagesContainer}></div>
      <input
        type='text'
        name='message'
        id='message'
        placeholder='Enter your message'
      />
    </div>
  );
};

export default IndividualChat;
