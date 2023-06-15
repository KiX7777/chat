import classes from './Home.module.css'
import Chat from '../Components/Chat'
import Login from '../Components/Login'

import { useAppSelector } from '../hooks'

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
