import classes from './Home.module.css';
import Chat from '../Components/Chat';
import Login from '../Components/Login';
import { useAppSelector, useAppDispatch } from '../hooks';
import { userActions } from '../Stores/UserSlice';
import i18n from '../i18n';

const Home = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang_code = e.target.value;
    dispatch(userActions.setLanguage(e.target.value));
    i18n.changeLanguage(lang_code);
  };
  return (
    <div className={classes.homeContainer}>
      <select onChange={onChangeLang} value={user.language} id='language'>
        <option value='hr'>🇭🇷</option>
        <option value='en'>🇬🇧</option>
      </select>
      {!user.loggedIn && <Login />}
      {user.loggedIn && <Chat />}
      {user.error && <h1>{user.error}</h1>}
    </div>
  );
};

export default Home;
