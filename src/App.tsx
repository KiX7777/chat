import './App.css';
import Home from './pages/Home';
import { useEffect } from 'react';
import { auth, setOnlineStatus } from './firebaseFunctions';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import { userActions } from './Stores/UserSlice';
import IndividualChat from './pages/IndividualChat';
function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  console.log(user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        dispatch(
          userActions.updateUser({
            username: user?.displayName,
            email: user?.email,
            id: user?.uid,
          })
        );
        console.log(user);
        setOnlineStatus(true, {
          username: user?.displayName,
          email: user?.email,
          id: user?.uid,
        });
      } else {
        return;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        {user.loggedIn && (
          <>
            <Route path='/chat/:id' element={<IndividualChat />}></Route>
            <Route path='*' element={<h1>404 not found</h1>} />
          </>
        )}
      </Routes>
      {/* <Home /> */}
      <footer>
        <a href='https://github.com/KiX7777' target='_blank'>
          Created by Kristian Božić <sup>Ⓡ</sup>
        </a>
      </footer>
    </>
  );
}

export default App;
