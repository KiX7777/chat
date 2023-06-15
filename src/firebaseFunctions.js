import { initializeApp } from 'firebase/app'
import { getStorage, ref as sRef } from 'firebase/storage'
import {
  get,
  getDatabase,
  ref,
  set,
  query,
  orderByKey,
  onDisconnect,
  orderByChild,
  equalTo,
  orderByValue,
  child,
} from 'firebase/database'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'

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
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
//____________________________________STORAGE____________________________________
export const storage = getStorage(app)
export const storageRef = sRef(storage)
export const usersStorageRef = sRef(storage, 'users')
//____________________________________DATABASE____________________________________
export const database = getDatabase()
export const usersRef = ref(database, 'users')
export const roomsRef = ref(database, 'rooms')

//____________________________________AUTH____________________________________

export const auth = getAuth(app)

//logout after session ends
setPersistence(auth, browserSessionPersistence)

export async function emailSignUp(email, password) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    console.log(res)
    const userData = res.user
    console.log(userData)

    return userData
  } catch (error) {
    return error.message
  }
}

export async function emailLogin(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    const userData = res.user
    console.log(userData)
    return userData
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

export async function logOut() {
  signOut(auth)
    .then(() => {
      console.log('logged out')
      return 'Logged out!'
    })
    .catch((error) => {
      console.log(error.message)
    })
}

export async function updateUsername(username) {
  try {
    updateProfile(auth.currentUser, {
      displayName: username,
    })
  } catch (error) {
    console.log(error)
  }
}

export async function checkRoom(room) {
  const usersRef = query(
    ref(database, 'rooms'),
    ...[orderByKey(), equalTo(room)]
  )
  const snapshot = await get(usersRef)
  const data = snapshot.val()
  return data
}

export const setOnlineStatus = async (status, user) => {
  if (user.id) {
    const nodeRef = child(usersRef, `${user.id}/online`)
    onDisconnect(nodeRef).set(false)
    await set(nodeRef, status)
  }
}

export const createUser = async (user) => {
  const nodeRef = child(usersRef, `${user.id}`)
  await set(nodeRef, { username: user.username, online: false })
}

// export const getUsersInRoom = (room) => {
//   const roomRef = ref(database, `rooms/${room}`)
// }
export async function checkUsername() {
  console.log('first')
  const usersRef = query(ref(database, 'users'), ...[orderByValue()])
  const snapshot = await get(usersRef)
  const data = snapshot.val()
  const usernames = []
  for (const user in data) {
    usernames.push(data[user].username)
  }
  return usernames
}
