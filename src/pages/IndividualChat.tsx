import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../Stores/UserSlice';
import classes from '../Components/IndiviudalChat.module.css';
import {
  ref,
  child,
  onValue,
  query,
  orderByValue,
  set,
  get,
} from 'firebase/database';
import { database, usersRef } from '../firebaseFunctions';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Messages from '../Components/Messages';
import { useNavigate } from 'react-router-dom';
import ChatForm from '../Components/ChatForm';
interface ChatInfo {
  users: string[];
}

console.log(new Date(1687190838622));

const IndividualChat = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { id: combinedID } = useParams();
  const [chatMessages, setchatMessages] = useState<[][]>([]);
  const currentUser = useAppSelector((state) => state.user);
  const [otherUser, setOtherUser] = useState<{
    id: string;
    username: string;
  }>();

  useEffect(() => {
    const chatRef = query(
      ref(database, `users/${currentUser.id}/chats/${combinedID}/messages`),
      ...[orderByValue()]
    );
    async function getMsgs() {
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const msgs = [];
        snapshot.forEach((val) => {
          const msg = val.val();
          msgs.push(msg);
          console.log(msgs);
        });
        setchatMessages(msgs);
      });

      return unsubscribe;
    }

    getMsgs();

    return () => {
      getMsgs();
    };
  }, [combinedID, currentUser]);

  useEffect(() => {
    async function getOtherUser() {
      const chatUsersRef = query(
        ref(database, `users/${currentUser.id}/chats/${combinedID}/users`)
      );

      const snapshot = await get(chatUsersRef);
      const data = snapshot.val();
      console.log(data);
      if (data) {
        const other = data.find((u) => u.id !== currentUser.id);
        console.log(other);
        setOtherUser(other);
      }
    }

    getOtherUser();
  }, [combinedID, currentUser.id]);
  console.log(chatMessages);
  return (
    <div className={classes.chatContainer}>
      <button
        type='button'
        className={classes.backBtn}
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </button>
      <button
        className={classes.logOut}
        onClick={async () => {
          const onlineStatusRef = child(usersRef, `${user.id}/online`);
          await set(onlineStatusRef, false);
          dispatch(logout());
          navigate('/');
        }}
      >
        LOG OUT
      </button>
      <h1>{otherUser?.username}</h1>

      <div className={classes.messagesContainer}>
        <Messages messages={chatMessages} />
        {/* {chatMessages.map((msg, idx) => (
          <div key={idx}>
            <p>{msg.msg}</p>
            <span>{msg.sender}</span>
          </div>
        ))} */}
        <ChatForm
          combinedID={combinedID as string}
          receiverID={otherUser?.id}
        />
      </div>
    </div>
  );
};

export default IndividualChat;
