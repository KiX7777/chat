// import Home from './pages/Home';
import { useEffect, lazy, Suspense } from 'react';
import { auth, setOnlineStatus } from './utilities/firebaseFunctions';
import { useAppDispatch, useAppSelector } from './hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { userActions } from './Stores/UserSlice';
// import LoginPage from './pages/LoginPage';
const LoginPage = lazy(() => import('./pages/LoginPage'));
const IndividualChat = lazy(() => import('./pages/IndividualChat'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Layout = lazy(() => import('./UI/Layout'));

import { AnimatePresence } from 'framer-motion';
import Loader from './UI/Loader';

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  const loading = useAppSelector((state) => state.user.loading);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(userActions.setLoading(false));
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

  return loading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Layout>
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route
              path='/'
              element={
                user.loggedIn ? (
                  <Suspense fallback={<Loader />}>
                    <Home />
                  </Suspense>
                ) : (
                  <Navigate to={'/login'} />
                )
              }
            />
            <Route
              path='login'
              element={
                user.loggedIn ? (
                  <Navigate to={'/'} />
                ) : (
                  <Suspense fallback={<Loader />}>
                    <LoginPage />
                  </Suspense>
                )
              }
            />
            <Route
              path='/chat/:id'
              element={
                user.loggedIn ? (
                  <Suspense fallback={<Loader />}>
                    <IndividualChat />
                  </Suspense>
                ) : (
                  <Navigate to={'/login'} />
                )
              }
            ></Route>

            <Route
              path='*'
              element={
                <Suspense fallback={<Loader />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Suspense>
  );
}

export default App;
