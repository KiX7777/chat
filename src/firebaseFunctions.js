import { initializeApp } from 'firebase/app';
import { getStorage, ref as sRef } from 'firebase/storage';
import {
  get,
  getDatabase,
  ref,
  set,
  query,
  orderByKey,
  onDisconnect,
  equalTo,
  orderByValue,
  child,
  onValue,
} from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCmafre1ertf8VL88QzO_QKEkdAvgIICBI',
  authDomain: 'chatapp-22851.firebaseapp.com',
  projectId: 'chatapp-22851',
  storageBucket: 'gs://chatapp-22851.appspot.com',
  messagingSenderId: '825892753458',
  appId: '1:825892753458:web:6dd74f6c446d7d271d6c2b',
  measurementId: 'G-D6TCH89ZCF',
  databaseURL:
    'https://chatapp-22851-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//____________________________________STORAGE____________________________________
export const storage = getStorage(app);
export const storageRef = sRef(storage);
export const usersStorageRef = sRef(storage, 'users');
//____________________________________DATABASE____________________________________
export const database = getDatabase();
export const usersRef = ref(database, 'users');
export const roomsRef = ref(database, 'rooms');

//____________________________________AUTH____________________________________

export const auth = getAuth(app);

//logout after session ends
setPersistence(auth, browserSessionPersistence);

export async function emailSignUp(email, password) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userData = res.user;

    return userData;
  } catch (error) {
    return error.message;
  }
}

export async function emailLogin(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const userData = res.user;
    return userData;
  } catch (error) {
    return error.message;
  }
}

export async function logOut() {
  signOut(auth)
    .then(() => {
      return 'Logged out!';
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export async function updateUsername(username) {
  try {
    updateProfile(auth.currentUser, {
      displayName: username,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function checkRoom(room) {
  const usersRef = query(
    ref(database, 'rooms'),
    ...[orderByKey(), equalTo(room)]
  );
  const snapshot = await get(usersRef);
  const data = snapshot.val();
  return data;
}

export async function getIndividualChats(user) {
  const chatsRef = query(ref(database, `users/${user.id}`));
  const snapshot = await get(chatsRef);
  const data = snapshot.val();
  return data.chats;
}

export async function chatExists(user, combinedID) {
  const chatsRef = query(ref(database, `users/${user.id}/chats`));
  const ids = [];
  const snapshot = await get(chatsRef);
  const data = snapshot.val();
  const msgs = [...Object.entries(data)];
  for (const id in msgs) {
    ids.push(msgs[id][0]);
  }
  const exists = ids.includes(combinedID);
  return exists;
}

export const setOnlineStatus = async (status, user) => {
  if (user.id) {
    const nodeRef = child(usersRef, `${user.id}/online`);
    onDisconnect(nodeRef).set(false);
    await set(nodeRef, status);
  }
};

export const createUser = async (user) => {
  const nodeRef = child(usersRef, `${user.id}`);

  await set(nodeRef, user);
  const userChatsRef = child(usersRef, `${user.id}/chats`);
  await set(userChatsRef, false);
};

// export const getUsersInRoom = (room) => {
//   const roomRef = ref(database, `rooms/${room}`)
// }
export async function checkUsername() {
  const usersRef = query(ref(database, 'users'), ...[orderByValue()]);
  const snapshot = await get(usersRef);
  const data = snapshot.val();
  const usernames = [];
  for (const user in data) {
    usernames.push(data[user].username);
  }
  return usernames;
}

export async function getUsers() {
  const usersRef = query(ref(database, 'users'), ...[orderByValue()]);

  onValue(usersRef, (snapshot) => {
    const users = [];
    const data = snapshot.val();
    for (const user in data) {
      users.push(data[user]);
    }
    return users;
  });
}

export async function startIndividualChat(sender, receiver, id) {
  const receiverRef = ref(database, `users/${receiver.id}/chats`);
  const senderRef = ref(database, `users/${sender.id}/chats`);
  const userChats = ref(database, `userChats/${id}`);
  const childNodeRec = child(receiverRef, `${id}`);
  const childNodeSend = child(senderRef, `${id}`);

  await set(childNodeSend, {
    users: [
      { id: sender.id, username: sender.username },
      {
        id: receiver.id,
        username: receiver.username,
      },
    ],
    messages: false,
  });
  await set(childNodeRec, {
    users: [
      { id: sender.id, username: sender.username },
      {
        id: receiver.id,
        username: receiver.username,
      },
    ],
    messages: false,
  });

  await set(userChats, {
    id: sender.id,
    username: sender.username,
  });
}

export async function sendIndividualMessage(
  sender,
  receiverID,
  combinedID,
  message
) {
  const receiverRef = ref(database, `users/${receiverID}/chats/${combinedID}`);
  const senderRef = ref(database, `users/${sender.id}/chats/${combinedID}`);
  const childNodeRec = child(receiverRef, `messages/${Date.now()}`);
  const childNodeSend = child(senderRef, `messages/${Date.now()}`);
  await set(childNodeSend, {
    sender: sender.username,
    message: message,
    time: Date.now(),
  });
  await set(childNodeRec, {
    sender: sender.username,
    message: message,
    time: Date.now(),
  });
}
