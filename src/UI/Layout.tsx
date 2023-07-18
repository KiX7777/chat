import classes from './Layout.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { userActions, logout } from '../Stores/UserSlice';
import { chatActions } from '../Stores/ChatSlice';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const room = useAppSelector((state) => state.chat.room);
  const user = useAppSelector((state) => state.user);
  const currentLanguage = useAppSelector((state) => state.user.language);
  const { t } = useTranslation();
  const onChangeLang = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const lang_code = e.target.value;
    dispatch(userActions.setLanguage(e.target.value));
    i18n.changeLanguage(lang_code);
  };

  return (
    <div className={classes.layout}>
      {user.error && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={classes.errorMsg}
          >
            {user.error}
          </motion.div>
        </AnimatePresence>
      )}
      <header className={classes.header}>
        <Link
          to={'/'}
          onClick={() => {
            dispatch(chatActions.setRoom(''));
            dispatch(chatActions.closeChooseRoom());
          }}
        >
          <img src='/logo.webp' alt='Chatter logo' />
        </Link>
        {!user.loggedIn && (
          <select onChange={onChangeLang} value={currentLanguage} id='language'>
            <option value='hr'>🇭🇷</option>
            <option value='en'>🇬🇧</option>
          </select>
        )}
        {user.loggedIn && (
          <button
            className={classes.logOut}
            onClick={async () => {
              navigate('/');
              dispatch(chatActions.setRoom(''));
              dispatch(chatActions.closeChooseRoom());
              dispatch(logout({ room, user }));
              dispatch(chatActions.showConvos());
            }}
          >
            {t('logOut')}
          </button>
        )}
      </header>
      {children}
      <footer>
        <a href='https://github.com/KiX7777' target='_blank'>
          Created by Kristian Božić <sup>Ⓡ</sup>
        </a>
      </footer>
    </div>
  );
};

export default Layout;
