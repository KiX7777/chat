import classes from './MessageEl.module.css';
import { Message } from './Chat';
import { useAppSelector } from '../hooks';
import moment from 'moment/min/moment-with-locales';

import 'moment/locale/es';
import { useEffect, useRef, useState } from 'react';

const MessageEl = ({ message }: { message: Message; idx: number }) => {
  const user = useAppSelector((state) => state.user);
  moment.locale('hr');
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
