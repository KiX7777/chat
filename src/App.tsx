import Home from './pages/Home';
import { useEffect } from 'react';
import { auth, setOnlineStatus } from './utilities/firebaseFunctions';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import { userActions } from './Stores/UserSlice';
import IndividualChat from './pages/IndividualChat';
import Layout from './UI/Layout';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userActions.updateUser({
            username: user?.displayName,
            email: user?.email,
            id: user?.uid,
          })
        );
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
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          {user.loggedIn && (
            <>
              <Route path='/chat/:id' element={<IndividualChat />}></Route>
              <Route path='*' element={<h1>404 not found</h1>} />
            </>
          )}
        </Routes>
      </Layout>
    </>
  );
}

export default App;
