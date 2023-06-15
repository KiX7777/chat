import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './Components/Login'
import { useEffect } from 'react'
import { auth, setOnlineStatus } from './firebaseFunctions'
import { useAppDispatch, useAppSelector } from './hooks'
import { onAuthStateChanged } from 'firebase/auth'
import { userActions } from './Stores/UserSlice'
function App() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user)
  console.log(user)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user)
      if (user) {
        dispatch(
          userActions.updateUser({
            username: user?.displayName,
            email: user?.email,
            id: user?.uid,
          })
        )
        console.log(user)
      } else {
        return
      }
    })

    return () => {
      unsubscribe()
    }
  }, [dispatch])

  return (
    <>
      <Home />
      <footer>
        <a href='https://github.com/KiX7777' target='_blank'>
          Created by Kristian Božić <sup>Ⓡ</sup>
        </a>
      </footer>
    </>
  )
}

export default App
