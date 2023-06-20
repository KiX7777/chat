import classes from './Conversations.module.css';
import { getIndividualChats } from '../firebaseFunctions';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Message } from './Chat';
import { User } from '../Stores/UserSlice';
import moment from 'moment/min/moment-with-locales';
import { Link } from 'react-router-dom';
interface Chat {
  message: string;
  id: string;
  messages: Message[];
  interlocutor: string;
  time: string;
}

moment.locale('hr');

const Conversations = () => {
  const user = useAppSelector((state) => state.user);
  const [chats, setChats] = useState<Chat[]>([]);
  const dref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getChats(user: User) {
      const res: any = await getIndividualChats(user);
      const chats: Chat[] = [];
      for (const convo in res) {
        const chat: Chat = {
          id: convo,
          message: Object.entries<Chat>(res[convo].messages).slice(-1)[0][1]
            .message,
          time: moment(
            Object.entries<Chat>(res[convo].messages).slice(-1)[0][1].time
          ).format(),
          messages: res[convo].messages,
          interlocutor: res[convo].users.find(
            (u: User) => u.username !== user.username
          ).username,
        };
        chats.push(chat);
      }
      console.log(Object.entries(chats[0].messages).slice(-1)[0][1].message);
      setChats(chats);
    }

    getChats(user);

    // return () => {}
  }, [user]);

  return (
    <div ref={dref} className={classes.conversationsContainer}>
      <h1>CONVERSATIONS</h1>
      {chats.map((ch) => (
        <Link key={ch.id} to={`chat/${ch.id}`} className={classes.chatCard}>
          <h6>{ch.interlocutor}</h6>
          <div className={classes.lastMsg}>
            <small>{ch.message}</small>
            {/* <small className={classes.lastMsgTime}>{`${new Date(ch.time)
              .toLocaleTimeString()
              .slice(0, -3)}`}</small> */}
            <small className={classes.lastMsgTime}>
              {`${moment(ch.time).fromNow()}`}
            </small>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Conversations;
