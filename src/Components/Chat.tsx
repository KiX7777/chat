import { useEffect } from 'react';
import classes from './Chat.module.css';
import { useState } from 'react';
import { set, ref, child, onValue, onDisconnect } from 'firebase/database';
import { User } from '../Stores/UserSlice';

import { database, roomsRef, checkRoom } from '../utilities/firebaseFunctions';
import { chatActions } from '../Stores/ChatSlice';
import Conversations from './Conversations';
import { useAppSelector, useAppDispatch } from '../hooks';
import UserFinder from './UserFinder';
import RoomChat from '../pages/RoomChat';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

export type Message = {
  sender: string;
  message: string;
  time: object;
  image?: string;
};

const Chat = () => {
  const [room, setRoom] = useState('');
  const rm = useAppSelector((state) => state.chat.room);
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const chooseRoom = useAppSelector((state) => state.chat.chooseRoom);
  const user = useAppSelector((state) => state.user);
  const showConvos = useAppSelector((state) => state.chat.showConvos);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${room}`);

    //get messages when there is a change in the database
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((val) => {
        const msg = val.val();

        //push message to array only if it is a message → if it is a user object then skip
        if (msg && 'message' in msg) {
          msgs.push(msg);
        } else {
          return;
        }
      });
      dispatch(chatActions.setMessages(msgs));
    });

    return () => {
      unsubscribe();
    };
  }, [room, dispatch]);

  useEffect(() => {
    //listen for changes in the room and show users who are in the room
    const roomRef = ref(database, `rooms/${room}/users`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const usersOnline: string[] = [];
      const data = snapshot.val();
      for (const user in data) {
        usersOnline.push(data[user]);
      }
      dispatch(chatActions.setRoomUsers(usersOnline));
    });

    return () => {
      unsubscribe();
    };
  }, [room, dispatch]);

  const setUserInRoom = async (user: User) => {
    //when user connects add him to the room and vice versa
    const nodeRef = child(roomsRef, `${input}/users/${user.id}`);
    onDisconnect(nodeRef).set(null);
    await set(nodeRef, user.username);
  };

  const handleSubmit = async () => {
    //create new room if it does not exist already
    if (input) {
      const exists = await checkRoom(input);
      if (!exists) {
        const nodeRef = child(roomsRef, `${input}`);
        await set(nodeRef, false);
        setRoom(input);
        dispatch(chatActions.setRoom(input));
        dispatch(chatActions.showChooseRoomBtn());
        setUserInRoom(user);
        dispatch(chatActions.closeFindOptions());
        dispatch(chatActions.closeShowConvos());
      } else {
        //just enter room
        setRoom(input);

        dispatch(chatActions.setRoom(input));
        dispatch(chatActions.showChooseRoomBtn());
        setUserInRoom(user);
        dispatch(chatActions.closeFindOptions());
        dispatch(chatActions.closeShowConvos());
      }
    }
  };

  return (
    <div className={classes.chatContainer}>
      {user.loggedIn && (
        <p className={classes.userGreet}>Hello, {user.username}</p>
      )}

      <UserFinder />
      <div className={classes.btns}>
        {room && (
          <button
            type='button'
            className={`${classes.btn} ${classes.backBtn}`}
            onClick={() => {
              setRoom('');
              dispatch(chatActions.setRoom(''));
              dispatch(chatActions.closeChooseRoom());
            }}
          >
            {t('back')}
          </button>
        )}
        {chooseRoom && (
          <button
            className={classes.btn}
            onClick={() => {
              dispatch(chatActions.closeChooseRoom());
              dispatch(chatActions.closeFindOptions());
            }}
          >
            {t('changeRoom')}
          </button>
        )}
      </div>
      <button
        className={`${classes.btn} ${classes.convosBtn}`}
        onClick={() => {
          dispatch(chatActions.toggleShowConvos());
        }}
      >
        {showConvos ? t('hideConvos') : t('showConvos')}
      </button>
      <AnimatePresence mode='popLayout'>
        {showConvos && <Conversations key={'convos'} />}

        {!chooseRoom && (
          <motion.form
            key={'formroom'}
            layout
            className={classes.chooseRoom}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
              setInput('');
            }}
          >
            <input
              type='text'
              placeholder={t('selectRoom')}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button className={classes.btn}>{t('enterRoom')}</button>
          </motion.form>
        )}
      </AnimatePresence>

      {rm && <RoomChat />}
    </div>
  );
};

export default Chat;
