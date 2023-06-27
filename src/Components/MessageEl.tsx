import classes from './MessageEl.module.css';
import { Message } from './Chat';
import { useAppSelector } from '../hooks';
import 'moment/dist/locale/hr';
import 'moment/dist/locale/en-gb';
import moment from 'moment';
import { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { chatActions } from '../Stores/ChatSlice';

const MessageEl = ({ message }: { message: Message }) => {
  const [openPic, setopenPic] = useState(false);
  const dispatch = useAppDispatch();
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
      <p>
        {message.message}
        {message.image && (
          <img
            className={classes.msgImg}
            src={message.image}
            onClick={() => {
              dispatch(chatActions.setModalImage(message.image as string));
              dispatch(chatActions.toggleModal());
            }}
          />
        )}
      </p>
      <small>{`${moment(time).fromNow()}`}</small>
    </div>
  );
};

export default MessageEl;
