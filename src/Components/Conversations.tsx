import classes from './Conversations.module.css';
import { getIndividualChats } from '../utilities/firebaseFunctions';
import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../hooks';
import { Message } from './Chat';
import { User } from '../Stores/UserSlice';
import 'moment/dist/locale/hr';
import moment from 'moment';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
interface Chat {
  message: string;
  id: string;
  messages: Message[];
  interlocutor: string;
  time: string;
  image?: string;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const Conversations = () => {
  const user = useAppSelector((state) => state.user);
  user.language === 'hr' ? moment.locale('hr') : moment.locale('en-gb');
  const [chats, setChats] = useState<Chat[]>([]);
  const dref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    //get all user's individual chats when the component loads
    async function getChats(user: User) {
      const res = await getIndividualChats(user);
      const chats: Chat[] = [];
      for (const convo in res) {
        const chat: Chat = {
          id: convo,
          message: Object.entries<Chat>(res[convo].messages).slice(-1)[0][1]
            .message,
          image: Object.entries<Chat>(res[convo].messages).slice(-1)[0][1]
            .image,
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
      setChats(chats);
    }

    getChats(user);
  }, [user]);

  return (
    <motion.div
      key={'convos'}
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      layout
      ref={dref}
      className={classes.conversationsContainer}
    >
      <h1>{t('convos')}</h1>
      {chats.map((ch) => (
        <Link key={ch.id} to={`chat/${ch.id}`} className={classes.chatCard}>
          <h6>{ch.interlocutor}</h6>
          <div className={classes.lastMsg}>
            <small className={classes.lastTxt}>
              {ch.message}
              {ch.image && ' 🌆'}
            </small>
            <small className={classes.lastMsgTime}>
              {`${moment(ch.time).fromNow()}`}
            </small>
          </div>
        </Link>
      ))}
    </motion.div>
  );
};

export default Conversations;
