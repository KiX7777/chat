import classes from './MessageEl.module.css';
import { Message } from './Chat';
import { useAppSelector } from '../hooks';

const MessageEl = ({ message }: { message: Message }) => {
  const user = useAppSelector((state) => state.user);
  return (
    <div
      className={
        user.username !== message.sender
          ? `${classes.messageContainer} `
          : `${classes.messageContainer} ${classes.sender}`
      }
    >
      <h1>{message.sender}</h1>
      <p>{message.message}</p>
      <h4>{`${new Date(message.time).toLocaleTimeString().slice(0, -3)}`}</h4>
    </div>
  );
};

export default MessageEl;
