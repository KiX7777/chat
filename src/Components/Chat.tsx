import { useEffect } from 'react';
import classes from './Chat.module.css';
import { useState } from 'react';
import {
  set,
  ref,
  child,
  onValue,
  onDisconnect,
  remove,
} from 'firebase/database';
import { logout, User } from '../Stores/UserSlice';

import {
  database,
  roomsRef,
  checkRoom,
  usersRef,
  setOnlineStatus,
} from '../firebaseFunctions';
import { chatActions } from '../Stores/ChatSlice';
import Conversations from './Conversations';
import { useAppSelector, useAppDispatch } from '../hooks';
import UserFinder from './UserFinder';
import RoomChat from '../pages/RoomChat';
import { useNavigate } from 'react-router-dom';

export type Message = {
  sender: string;
  message: string;
  time: any;
};

const Chat = () => {
  const [room, setRoom] = useState('');
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const chooseRoom = useAppSelector((state) => state.chat.chooseRoom);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);
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
      setMessages(msgs);
    });

    return () => {
      unsubscribe();
    };
  }, [room]);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${room}/users`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const usersOnline: string[] = [];
      const data = snapshot.val();
      console.log(data);
      for (const user in data) {
        usersOnline.push(data[user]);
        console.log(usersOnline);
      }
      setRoomUsers(usersOnline);
    });

    return () => {
      unsubscribe();
    };
  }, [room]);

  const setUserInRoom = async (user: User) => {
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
        dispatch(chatActions.showChooseRoomBtn());
        setUserInRoom(user);
        dispatch(chatActions.closeFindOptions());
      } else {
        //just enter room
        setRoom(input);
        dispatch(chatActions.showChooseRoomBtn());
        setUserInRoom(user);
        dispatch(chatActions.closeFindOptions());
      }
    }
  };

  return (
    <div className={classes.chatContainer}>
      <UserFinder />
      <div className={classes.btns}>
        {room && (
          <button
            type='button'
            className={classes.btn}
            onClick={() => {
              setRoom('');
              console.log('test');
              dispatch(chatActions.closeChooseRoom());
            }}
          >
            Back
          </button>
        )}
        {chooseRoom && (
          <button
            className={classes.btn}
            onClick={() => {
              dispatch(chatActions.closeChooseRoom());
              dispatch(chatActions.closeFindOptions());

              console.log(roomUsers);
            }}
          >
            Change Room
          </button>
        )}
      </div>
      {!chooseRoom && (
        <form
          className={classes.chooseRoom}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            setInput('');
          }}
        >
          <input
            type='text'
            placeholder='Select room'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button className={classes.btn}>Enter room {input}</button>
        </form>
      )}
      <button
        className={`${classes.btn} ${classes.convosBtn}`}
        onClick={() => {
          dispatch(chatActions.toggleShowConvos());
        }}
      >
        {showConvos ? 'Hide conversations' : 'Show conversations'}
      </button>
      {room && (
        <RoomChat roomUsers={roomUsers} room={room} messages={messages} />
      )}
      <button
        className={classes.logOut}
        onClick={async () => {
          const roomUsersRef = ref(database, `rooms/${room}/users/${user.id}`);
          await remove(roomUsersRef);
          const onlineStatusRef = child(usersRef, `${user.id}/online`);
          await set(onlineStatusRef, false);
          setRoom('');
          dispatch(logout());
        }}
      >
        LOG OUT
      </button>
      {showConvos && <Conversations />}{' '}
    </div>
  );
};

export default Chat;
