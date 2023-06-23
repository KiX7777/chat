import classes from './MessageEl.module.css';
import { Message } from './Chat';
import { useAppSelector } from '../hooks';
import 'moment/dist/locale/hr';
import 'moment/dist/locale/en-gb';
import moment from 'moment';

const MessageEl = ({ message }: { message: Message }) => {
  const user = useAppSelector((state) => state.user);
  user.language === 'hr' ? moment.locale('hr') : moment.locale('en-gb');
  const time = moment(message.time).format();

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
      <h4>{`${moment(time).fromNow()}`}</h4>
    </div>
  );
};

export default MessageEl;
