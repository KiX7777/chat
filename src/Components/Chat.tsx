import React, { useEffect } from 'react'
import classes from './Chat.module.css'
import { useState, useRef } from 'react'
import {
  set,
  ref,
  child,
  onValue,
  onDisconnect,
  remove,
} from 'firebase/database'
import Messages from './Messages'
import { logout } from '../Stores/UserSlice'

import {
  database,
  roomsRef,
  checkRoom,
  usersRef,
  setOnlineStatus,
  checkUsername,
} from '../firebaseFunctions'
import ChatForm from './ChatForm'
import { useAppSelector, useAppDispatch } from '../hooks'

export type Message = {
  sender: string
  message: string
  time: any
}

const Chat = () => {
  const [room, setRoom] = useState('')
  const [input, setInput] = useState('')
  const dispatch = useAppDispatch()

  const [messages, setMessages] = useState<Message[]>([])
  const [chooseRoom, setChooseRoom] = useState(false)
  const [roomUsers, setRoomUsers] = useState<string[]>([])
  const user = useAppSelector((state) => state.user)

  useEffect(() => {
    const roomRef = ref(database, `rooms/${room}`)

    //get messages when there is a change in the database
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const msgs: Message[] = []
      snapshot.forEach((val) => {
        const msg = val.val()

        //push message to array only if it is a message → if it is a user object then skip
        if (msg && 'message' in msg) {
          msgs.push(msg)
        } else {
          return
        }
      })
      setMessages(msgs)
    })

    return () => {
      unsubscribe()
    }
  }, [room])

  useEffect(() => {
    const roomRef = ref(database, `rooms/${room}/users`)
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const usersOnline: string[] = []
      const data = snapshot.val()
      console.log(data)
      for (const user in data) {
        usersOnline.push(data[user])
        console.log(usersOnline)
      }
      setRoomUsers(usersOnline)
    })
  }, [room])

  const setUserInRoom = async (user) => {
    const nodeRef = child(roomsRef, `${input}/users/${user.id}`)
    onDisconnect(nodeRef).set(null)
    await set(nodeRef, user.username)
  }

  const handleSubmit = async () => {
    //create new room if it does not exist already
    if (input) {
      const exists = await checkRoom(input)
      if (!exists) {
        const nodeRef = child(roomsRef, `${input}`)
        await set(nodeRef, false)
        setRoom(input)
        setChooseRoom(true)
        setOnlineStatus(true, user)
        setUserInRoom(user)
      } else {
        //just enter room
        setRoom(input)
        setChooseRoom(true)
        setOnlineStatus(true, user)
        setUserInRoom(user)
      }
    }
  }

  return (
    <div className={classes.chatContainer}>
      {chooseRoom && (
        <button
          className={classes.btn}
          onClick={() => {
            setChooseRoom(false)
            console.log(roomUsers)
          }}
        >
          Change Room
        </button>
      )}
      {!chooseRoom && (
        <form
          className={classes.chooseRoom}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
            setInput('')
          }}
        >
          <input
            type='text'
            placeholder='Select room'
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
          />
          <button className={classes.btn}>Enter room {input}</button>
        </form>
      )}
      {room && (
        <div className={classes.messagesContainer}>
          <h1 className={classes.room}>{room}</h1>
          <h3>
            Online: <p>{roomUsers.join(', ')}</p>
          </h3>
          <Messages messages={messages} />
          <ChatForm room={room} />
        </div>
      )}

      <button
        className={classes.logOut}
        onClick={async () => {
          const roomUsersRef = ref(database, `rooms/${room}/users/${user.id}`)
          await remove(roomUsersRef)
          const onlineStatusRef = child(usersRef, `${user.id}/online`)
          await set(onlineStatusRef, false)
          setRoom('')
          dispatch(logout())
        }}
      >
        LOG OUT
      </button>
      <button
        onClick={async () => {
          console.log(user)
          // checkUsername(input)
          console.log(await checkUsername(input))
        }}
      >
        state
      </button>
    </div>
  )
}

export default Chat
