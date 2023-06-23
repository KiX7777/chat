import classes from './RoomChat.module.css';
import Messages from '../Components/Messages';
import ChatForm from '../Components/ChatForm';
import { useAppSelector } from '../hooks';

const RoomChat = () => {
  const state = useAppSelector((state) => state.chat);
  return (
    <div className={classes.roomChatContainer}>
      <div className={classes.messagesContainer}>
        <h1 className={classes.room}>{state.room}</h1>
        <h3>
          Online: <p>{state.roomUsers.join(', ')}</p>
        </h3>
        <Messages messages={state.roomMessages} />
        <ChatForm room={state.room} />
      </div>
    </div>
  );
};

export default RoomChat;
