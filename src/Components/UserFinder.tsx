/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import classes from './UserFinder.module.css';
import { database, chatExists } from '../firebaseFunctions';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ref,
  orderByValue,
  query,
  onValue,
  child,
  set,
} from 'firebase/database';
import { useAppSelector, useAppDispatch } from '../hooks';
import { startIndChat } from '../Stores/UserSlice';
import { chatActions } from '../Stores/ChatSlice';

export interface UserCardProps {
  username: string;
  id: string;
  online: boolean;
}

export const UserCard = ({ user }: { user: UserCardProps }) => {
  const currentUser = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const combinedID =
    currentUser.id > user.id
      ? currentUser.id + user.id
      : user.id + currentUser.id;

  return (
    <div className={classes.userCard}>
      <h1
        onClick={() => {
          // setOpenChat(combinedID);
        }}
      >
        {user.username}
      </h1>
      {user.online && <span className={classes.onlineIndicator}></span>}
      {user.username !== currentUser.username ? (
        <button
          onClick={async () => {
            const exists = await chatExists(currentUser, combinedID);
            if (exists) {
              console.log('exits → navigating');
              navigate(`/chat/${combinedID}`);
            } else {
              // startIndividualChat(currentUser, user, combinedID);
              console.log('doesnt exist → creating and navigating');
              dispatch(
                startIndChat({
                  currentUser,
                  user,
                  combinedID,
                })
              );
              navigate(`/chat/${combinedID}`);
            }
          }}
        >
          MESSAGE
        </button>
      ) : (
        <img src='/user.webp' alt={user.username} />
      )}
    </div>
  );
};

const UserFinder = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [users, setusers] = useState<UserCardProps[]>([]);
  const [foundUsers, setFoundUsers] = useState<UserCardProps[] | boolean>(
    false
  );
  const onlineUsers = users.slice().filter((u) => u.online);
  // const [seeOnlineUsers, setseeOnlineUsers] = useState(false);
  const [seeAllUsers, setseeAllUsers] = useState(false);
  const seeOnlineUsers = useAppSelector((state) => state.chat.seeAllUsers);

  useEffect(() => {
    const usersRef = query(ref(database, 'users'), ...[orderByValue()]);

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const users = [];
      const data = snapshot.val();
      console.log(data);
      for (const user in data) {
        users.push(data[user]);
      }
      setusers(users);
      console.log(users);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.KeyboardEvent) {
    const input = inputRef.current?.value.toLowerCase() as string;
    if (e.key === 'Enter' && input !== '') {
      console.log(foundUsers);
      const found = users
        .slice()
        .filter((user) => user.username.toLowerCase().includes(input));
      console.log(found);
      if (found) {
        setFoundUsers(found);
        setseeAllUsers(false);
        inputRef.current!.value = '' as string;
      }
    }
  }

  let foundUsersCards;
  if (typeof foundUsers === 'object' && foundUsers.length > 0) {
    foundUsersCards = foundUsers.map((us) => (
      <UserCard key={us.id} user={us} />
    ));
  } else if (typeof foundUsers === 'object' && foundUsers.length === 0) {
    foundUsersCards = <h4>Users not found</h4>;
  }

  return (
    <div
      className={
        !seeOnlineUsers
          ? `${classes.userFinder}`
          : `${classes.userFinder} ${classes.open}`
      }
    >
      <button
        type='button'
        onClick={() => {
          dispatch(chatActions.toggleFindOptions());
          // setseeOnlineUsers((prev) => !prev);
        }}
      >
        Find User(s)
      </button>
      {seeOnlineUsers && (
        <>
          <input
            type='text'
            placeholder='Find user...'
            ref={inputRef}
            onKeyDown={(e) => {
              handleSubmit(e);
            }}
          />
          <button
            type='button'
            onClick={() => {
              setseeAllUsers((prev) => !prev);
              setFoundUsers(false);
            }}
          >
            {seeAllUsers
              ? onlineUsers.length > 1
                ? 'ONLINE'
                : 'No users online'
              : 'See Online Users'}
          </button>

          {seeAllUsers &&
            onlineUsers.filter((us) => us.username !== currentUser.username)
              .length > 0 && (
              <div className={classes.onlineUsers}>
                <div className={classes.onlineUsersContainer}>
                  {onlineUsers
                    .filter((us) => us.username !== currentUser.username)
                    .map((u) => (
                      <UserCard key={u.id} user={u} />
                    ))}
                </div>
              </div>
            )}
          {foundUsersCards}
        </>
      )}
    </div>
  );
};

export default UserFinder;
