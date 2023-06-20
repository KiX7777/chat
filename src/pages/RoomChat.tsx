import React from 'react';
import { Message } from '../Components/Chat';
import classes from './RoomChat.module.css';
import Messages from '../Components/Messages';
import ChatForm from '../Components/ChatForm';

const RoomChat = ({
  room,
  roomUsers,
  messages,
}: {
  room: string;
  roomUsers: string[];
  messages: Message[];
}) => {
  return (
    <div className={classes.roomChatContainer}>
      <div className={classes.messagesContainer}>
        <h1 className={classes.room}>{room}</h1>
        <h3>
          Online: <p>{roomUsers.join(', ')}</p>
        </h3>
        <Messages messages={messages} />
        <ChatForm room={room} />
      </div>
    </div>
  );
};

export default RoomChat;
