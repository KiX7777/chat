import { useEffect } from 'react';
import { Message } from './Chat';
import classes from './Messages.module.css';
import MessageEl from './MessageEl';
import { useRef } from 'react';
import { chatActions } from '../Stores/ChatSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

type Messages = {
  messages: Message[];
};

const Messages = (props: Messages) => {
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);
  const msgs = props.messages.map((msg, idx) => (
    <MessageEl key={idx} message={msg} />
  ));

  useEffect(() => {
    //scroll down when new message is sent/received
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [props.messages]);

  return (
    <div className={classes.messagesContainer}>
      {chatState.imageModal && (
        <div
          onClick={() => {
            dispatch(chatActions.closeModal());
          }}
          className={
            chatState.imageModal
              ? `${classes.backdrop} ${classes.open}`
              : `${classes.backdrop}`
          }
        ></div>
      )}

      <div
        onClick={() => {
          dispatch(chatActions.closeModal());
        }}
        style={{
          backgroundImage: `url(${chatState.modalImage})`,
        }}
        className={
          chatState.imageModal
            ? `${classes.imgModal} ${classes.open}`
            : `${classes.imgModal}`
        }
      ></div>

      {msgs}
      <div ref={scrollBottomRef} className={classes.bottomScroll}></div>
    </div>
  );
};

export default Messages;
