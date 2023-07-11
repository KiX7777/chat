import { useAppDispatch, useAppSelector } from '../hooks';
import classes from './IndiviudalChat.module.css';
import { ref, onValue, query, orderByValue, get } from 'firebase/database';
import { database } from '../utilities/firebaseFunctions';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '../Components/Chat';
import Messages from '../Components/Messages';
import { useNavigate } from 'react-router-dom';
import ChatForm from '../Components/ChatForm';
import { useTranslation } from 'react-i18next';
import { chatActions } from '../Stores/ChatSlice';
import { Unsubscribe } from 'firebase/auth';

const IndividualChat = () => {
  const navigate = useNavigate();
  const { id: combinedID } = useParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [chatMessages, setchatMessages] = useState<Message[]>([]);
  const currentUser = useAppSelector((state) => state.user);
  const [otherUser, setOtherUser] = useState<{
    id: string;
    username: string;
  }>();

  useEffect(() => {
    //get the messages for the chat with the selected user
    const chatRef = query(
      ref(database, `users/${currentUser.id}/chats/${combinedID}/messages`),
      ...[orderByValue()]
    );
    async function getMsgs(): Promise<Unsubscribe> {
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((val) => {
          const msg = val.val();
          msgs.push(msg);
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
    //get the other user
    async function getOtherUser() {
      const chatUsersRef = query(
        ref(database, `users/${currentUser.id}/chats/${combinedID}/users`)
      );

      const snapshot = await get(chatUsersRef);
      const data = snapshot.val();
      if (data) {
        const other = data.find(
          (u: { id: string; username: string }) => u.id !== currentUser.id
        );
        setOtherUser(other);
      }
    }

    getOtherUser();
  }, [combinedID, currentUser.id]);

  return (
    <div className={classes.chatContainer}>
      <div className={classes.btns}>
        <button
          type='button'
          className={classes.backBtn}
          onClick={() => {
            navigate(-1);
            dispatch(chatActions.setRoom(''));
            dispatch(chatActions.closeChooseRoom());
          }}
        >
          {t('back')}
        </button>
      </div>
      <h1>{otherUser?.username}</h1>

      <div className={classes.messagesContainer}>
        <Messages messages={chatMessages} />
        <ChatForm
          combinedID={combinedID as string}
          receiverID={otherUser?.id}
        />
      </div>
    </div>
  );
};

export default IndividualChat;
