import React from 'react'
import classes from './Home.module.css'
import Chat from '../Components/Chat'
import Login from '../Components/Login'
import { roomsRef } from '../firebaseFunctions'
import { child, set } from 'firebase/database'
import { useAppSelector, useAppDispatch } from '../hooks'

const Home = () => {
  const user = useAppSelector((state) => state.user)
  return (
    <div className={classes.homeContainer}>
      {!user.loggedIn && <Login />}
      {user.loggedIn && <Chat />}
    </div>
  )
}

export default Home
